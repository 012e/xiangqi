package com.se330.ctuong_backend.service.engine;

import lombok.RequiredArgsConstructor;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FairyStockFishEngineFactory {
    private final GenericObjectPool<FairyStockFishEngine> fairyStockFishEnginePool;

    public FairyStockFishEngine borrow() {
        try {
            return fairyStockFishEnginePool.borrowObject();
        } catch (Exception e) {
            throw new RuntimeException("Failed to borrow FairyStockFishEngine from pool", e);
        }
    }

    public void restore(FairyStockFishEngine engine) {
        try {
            fairyStockFishEnginePool.returnObject(engine);
        } catch (Exception e) {
            throw new RuntimeException("Failed to return FairyStockFishEngine to pool", e);
        }
    }
}
