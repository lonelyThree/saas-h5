const STORAGE_KEY = 'salesManQrSession';

// 存入会话
export function setQrSession(inviteCode, bindType, activityId, appKey) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            inviteCode,
            bindType,
            activityId,
            appKey
        }));
    } catch (e) {
    }
}

// 读取会话，并可选地传入当前上下文做校验
export function getQrSession(currentContext) {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null; // 统一返回 null
        
        const session = JSON.parse(raw);
        
        // 简单的校验，确保解析出来的是对象
        if (!session || typeof session !== 'object') return null;

        if (currentContext) {
            const same = session.bindType === currentContext.bindType
                      && session.activityId === currentContext.activityId
                      && session.appKey === currentContext.appKey;
            return same ? session : null; // 统一返回 null
        }
        return session;
    } catch (e) {
        // 防止 JSON.parse 出错导致崩溃
        // console.warn('Invalid session data in storage', e);
        return null;
    }
}
