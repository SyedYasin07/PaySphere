package com.sy.main.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sy.main.dto.UserRespDTO;
import com.sy.main.service.UserService;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    @Autowired
    private UserService us;

    @PutMapping("/{userId}/block")
    public UserRespDTO blockUser(@PathVariable Integer userId) {
        return us.blockUser(userId);
    }

    @PutMapping("/{userId}/unblock")
    public UserRespDTO unblockUser(@PathVariable Integer userId) {
        return us.unblockUser(userId);
    }
    @GetMapping
    public List<UserRespDTO> getAllUsers() {
        return us.getAllUsers();
    }

    @GetMapping("/{userId}")
    public UserRespDTO getUserById(@PathVariable Integer userId) {
        return us.getUserById(userId);
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable Integer userId) {
        us.deleteUser(userId);
        return "User deleted successfully";
    }
}