package com.se330.ctuong_backend.service.engine;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.PooledObjectFactory;
import org.apache.commons.pool2.impl.DefaultPooledObject;

@Slf4j
public class FairyStockfishEnginePool implements PooledObjectFactory<FairyStockFishEngine> {
    private FairyStockFishEngine getEngine(PooledObject<FairyStockFishEngine> pooledObject) {
        return pooledObject.getObject();
    }

    @Override
    public void activateObject(PooledObject<FairyStockFishEngine> pooledObject) throws Exception {
        final var engine = getEngine(pooledObject);
        engine.start();
    }

    @Override
    public void destroyObject(PooledObject<FairyStockFishEngine> pooledObject) throws Exception {
        final var engine = getEngine(pooledObject);
        if (engine.isRunning()) {
            engine.exit();
        }
    }

    @Override
    public PooledObject<FairyStockFishEngine> makeObject() throws Exception {
        final var engine = FairyStockFishEngine.withDefaults();
        log.info("Another xiangqi engine are created");
        return new DefaultPooledObject<>(engine);
    }

    @Override
    public void passivateObject(PooledObject<FairyStockFishEngine> pooledObject) throws Exception {
        final var engine = getEngine(pooledObject);
        engine.reset();
    }

    @Override
    public boolean validateObject(PooledObject<FairyStockFishEngine> pooledObject) {
        final var engine = getEngine(pooledObject);
        return engine.isReady();
    }
}
