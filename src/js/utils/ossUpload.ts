import OSS from 'ali-oss'
import axios from '../axios/index'

/* ================== 配置区 ================== */

const MAX_IMAGE_SIZE = 20 * 1024 * 1024       // 20MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024     // 200MB
const STS_EXPIRE_BUFFER = 30                 // 提前 30s 续期
const CHECKPOINT_PREFIX = 'oss_checkpoint_'

/* ================== 类型 ================== */

export interface STSResponse {
  accessKeyId: string
  accessKeySecret: string
  securityToken: string
  expiration: number
  region: string
  bucket: string
  moduleMap: object      // 授权的目录列表
}

interface UploadOptions {
  dir: string
  dirs: string[]
  domain: string
  onProgress?: (p: number) => void
}

/* ================== 内部缓存 ================== */

let ossClient: OSS | null = null
let stsCache: STSResponse | null = null
let ossDir: string | null = null

/* ================== STS ================== */

function isSTSExpired(sts: STSResponse) {
  return Date.now() / 1000 > sts.expiration - STS_EXPIRE_BUFFER
}

async function fetchSTS(dirs: string[], domain: string): Promise<STSResponse> {
  const res = await axios.post(domain +'Oss/GetSTSToken', {
    dirs: dirs
  }, { toJSON: true })
  return res.data.data
}

async function ensureSTS(dirs: string[], dir: string, domain: string) {
  if (
    !stsCache ||
    isSTSExpired(stsCache) ||
    !stsCache.moduleMap || 
    !stsCache!.moduleMap[dir]
  ) {
    stsCache = await fetchSTS(dirs, domain)
    ossClient = null
    ossDir = null
  } else {
  }
}

/* ================== OSS Client ================== */

export async function getOssClient(initDirs: string[] = [], dir: string, domain: string) {
  await ensureSTS(initDirs, dir, domain)

  if (ossClient) return ossClient

  ossClient = new OSS({
    region: stsCache!.region,
    accessKeyId: stsCache!.accessKeyId,
    accessKeySecret: stsCache!.accessKeySecret,
    stsToken: stsCache!.securityToken,
    bucket: stsCache!.bucket
  })

  return ossClient
}

/* ================== 工具 ================== */

function checkFileSize(file: File, dir: string) {
  if ((dir.includes('image') || dir.includes('img')) && file.size > MAX_IMAGE_SIZE) {
    throw new Error('图片大小不能超过 20MB')
  }
  if (dir.includes('video') && file.size > MAX_VIDEO_SIZE) {
    throw new Error('视频大小不能超过 200MB')
  }
}

function getExt(name: string) {
  return name.slice(name.lastIndexOf('.'))
}

function getCheckpointKey(file: File, dir: string) {
  return `${CHECKPOINT_PREFIX}${dir}_${file.name}_${file.size}`
}

/* ================== 秒传（HEAD 判断） ================== */

async function tryFastUpload(
  client: OSS,
  objectKey: string
): Promise<string | null> {
  try {
    await client.head(objectKey)
    return client.signatureUrl(objectKey).split('?')[0]
  } catch {
    return null
  }
}

/* ================== 上传主函数 ================== */

export async function uploadToOSS(
  file: File,
  options: UploadOptions
): Promise<string> {
  const { dir, onProgress } = options

  checkFileSize(file, dir)

  // 确保该目录已授权
  await ensureSTS(options.dirs, options.dir, options.domain)
  const client = await getOssClient(options.dirs, options.dir, options.domain)

  ossDir = stsCache!.moduleMap[dir]

  const ext = getExt(file.name)
  const objectKey = `${ossDir}${Math.random()
    .toString(36)
    .slice(2)}${ext}`

  // 秒传
  const fastUrl = await tryFastUpload(client, objectKey)
  if (fastUrl) return fastUrl

  // 断点续传
  const checkpointKey = getCheckpointKey(file, dir)
  let checkpoint: any = null

  const saved = localStorage.getItem(checkpointKey)
  if (saved) checkpoint = JSON.parse(saved)

  const result = await client.multipartUpload(objectKey, file, {
    checkpoint,
    parallel: 4,
    partSize: 1024 * 1024 * 5, // 5MB
    retryMax: 3,
    progress(p, cp) {
      onProgress?.(Math.floor(p * 100))
      localStorage.setItem(checkpointKey, JSON.stringify(cp))
    }
  })

  localStorage.removeItem(checkpointKey)

  return result.res.requestUrls[0].split('?')[0]
}
