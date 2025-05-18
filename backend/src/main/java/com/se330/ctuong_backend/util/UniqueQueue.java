package com.se330.ctuong_backend.util;

import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class UniqueQueue<T> {
    private final Queue<T> queue = new ConcurrentLinkedQueue<>();
    private final Set<T> set = ConcurrentHashMap.newKeySet();

    public UniqueQueue() {
    }

    public synchronized void enqueue(T item) {
        if (set.add(item)) { // Nếu chưa có thì thêm vào queue
            queue.offer(item);
        }
    }

    public synchronized T dequeue() {
        T item = queue.poll();
        if (item != null) {
            set.remove(item);
        }
        return item;
    }

    public boolean contains(T item) {
        return set.contains(item);
    }

    public boolean isEmpty() {
        return queue.isEmpty();
    }

    public int size() {
        return queue.size();
    }
}
