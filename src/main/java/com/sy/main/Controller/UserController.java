package com.sy.main.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.dto.ChangePasswordDTO;
import com.sy.main.dto.EmailVerificationDTO;
import com.sy.main.dto.ForgotPasswordDTO;
import com.sy.main.dto.LoginReqDTO;
import com.sy.main.dto.LoginRespDTO;
import com.sy.main.dto.RegReqDTO;
import com.sy.main.dto.ResetPasswordDTO;
import com.sy.main.dto.UserRespDTO;
import com.sy.main.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService us;
	
	
	@PostMapping("/register")
	public UserRespDTO registerUser(@RequestBody RegReqDTO req) {
		return us.regUser(req);
	}
	
	@PostMapping("/login")
	public LoginRespDTO  loginUser(@RequestBody LoginReqDTO req) {
		return us.loginUser(req);
	}
	@GetMapping("/me")
	public UserRespDTO getMyProfile() {
	    return us.getMyProfile();
	}
	
@GetMapping("/{id}")
	public UserRespDTO getUserById(@PathVariable Integer id) {
		return us.getUserById(id);
	}
@GetMapping
public List<UserRespDTO> getAllUsers(){
	return us.getAllUsers();
}
@PutMapping("/me")
public UserRespDTO updateMyProfile(
        @RequestBody RegReqDTO req) {

    return us.updateMyProfile(req);
}
@PutMapping("/{id}")
public UserRespDTO updateUser(@PathVariable Integer id,@RequestBody RegReqDTO req) {
	return us.updateUser(id, req);
}
@PutMapping("/{id}/block")
public UserRespDTO blockUser(@PathVariable Integer id) {
    return us.blockUser(id);
}

@PutMapping("/{id}/unblock")
public UserRespDTO unblockUser(@PathVariable Integer id) {
    return us.unblockUser(id);
}
@DeleteMapping("/{id}")
public void deleteUser(@PathVariable Integer id) {
	us.deleteUser(id);
}
@PutMapping("/me/password")
public String changePassword(
        @RequestBody ChangePasswordDTO request) {

    us.changePassword(request);

    return "Password changed successfully";
}
@PostMapping("/forgot-password")
public String forgotPassword(
        @RequestBody ForgotPasswordDTO request) {

    return us.forgotPassword(request);
}
@PostMapping("/reset-password")
public String resetPassword(
        @RequestBody ResetPasswordDTO request) {

    us.resetPassword(request);

    return "Password reset successfully";
}
@PostMapping("/send-verification")
public String sendVerification(
        @RequestBody EmailVerificationDTO request) {

    return us.sendVerificationToken(request);
}
@GetMapping("/verify-email")
public String verifyEmail(
        @RequestParam String token) {

    us.verifyEmail(token);

    return "Email verified successfully";
}


}
