package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.dto.rest.UserDto;
import com.se330.ctuong_backend.model.Friendship;
import com.se330.ctuong_backend.repository.FriendRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendService {
    
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public void makeFriend(Long userId, Long friendId) {
        if (userId.equals(friendId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        // Check if users exist
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var friend = userRepository.findById(friendId)
                .orElseThrow(() -> new IllegalArgumentException("Friend user not found"));

        // Check if friendship already exists
        Optional<Friendship> existingFriendship = friendRepository.findFriendshipBetweenUsers(userId, friendId);
        if (existingFriendship.isPresent()) {
            String status = existingFriendship.get().getStatus();
            if ("accepted".equals(status)) {
                throw new IllegalStateException("Users are already friends");
            } else if ("pending".equals(status)) {
                throw new IllegalStateException("Friend request already sent");
            }
        }

        // Create new friend request
        Friendship friendship = Friendship.builder()
                .user1(user)
                .user2(friend)
                .status("pending")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .requestOwner(user)
                .build();

        friendRepository.save(friendship);
        log.info("Friend request sent from user {} to user {}", userId, friendId);
    }

    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        Optional<Friendship> friendship = friendRepository.findFriendshipBetweenUsers(userId, friendId);
        
        if (friendship.isEmpty()) {
            throw new IllegalArgumentException("Friendship not found");
        }

        friendRepository.delete(friendship.get());
        log.info("Friendship removed between user {} and user {}", userId, friendId);
    }

    @Transactional
    public void acceptFriendRequest(Long userId, Long friendId) {
        Optional<Friendship> friendshipOpt = friendRepository.findFriendshipBetweenUsers(userId, friendId);
        
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("Friend request not found");
        }

        Friendship friendship = friendshipOpt.get();
        
        if (!"pending".equals(friendship.getStatus())) {
            throw new IllegalStateException("Friend request is not pending");
        }

        // Check if the current user is the recipient of the request
        if (!friendship.getUser2().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only accept friend requests sent to you");
        }

        friendship.setStatus("accepted");
        friendRepository.save(friendship);
        log.info("Friend request accepted between user {} and user {}", userId, friendId);
    }

    @Transactional
    public void rejectFriendRequest(Long userId, Long friendId) {
        Optional<Friendship> friendshipOpt = friendRepository.findFriendshipBetweenUsers(userId, friendId);
        
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("Friend request not found");
        }

        Friendship friendship = friendshipOpt.get();
        
        if (!"pending".equals(friendship.getStatus())) {
            throw new IllegalStateException("Friend request is not pending");
        }

        // Check if the current user is the recipient of the request
        if (!friendship.getUser2().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only reject friend requests sent to you");
        }

        friendRepository.delete(friendship);
        log.info("Friend request rejected between user {} and user {}", userId, friendId);
    }

    public List<UserDto> getFriendList(Long userId) {
        List<Friendship> friendships = friendRepository.findAcceptedFriendshipsByUserId(userId);
        
        return friendships.stream()
                .map(friendship -> {
                    // Get the friend (the other user in the friendship)
                    var friend = friendship.getUser1().getId().equals(userId) 
                            ? friendship.getUser2() 
                            : friendship.getUser1();
                    return modelMapper.map(friend, UserDto.class);
                })
                .collect(Collectors.toList());
    }

    public List<UserDto> getPendingFriendRequests(Long userId) {
        List<Friendship> pendingRequests = friendRepository.findPendingFriendRequestsForUser(userId);
        
        return pendingRequests.stream()
                .map(friendship -> modelMapper.map(friendship.getUser1(), UserDto.class))
                .collect(Collectors.toList());
    }

    public List<UserDto> getSentFriendRequests(Long userId) {
        List<Friendship> sentRequests = friendRepository.findSentFriendRequestsByUser(userId);
        
        return sentRequests.stream()
                .map(friendship -> modelMapper.map(friendship.getUser2(), UserDto.class))
                .collect(Collectors.toList());
    }
}
