package com.sy.main.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sy.main.dto.ChangePasswordDTO;
import com.sy.main.dto.EmailVerificationDTO;
import com.sy.main.dto.ForgotPasswordDTO;
import com.sy.main.dto.LoginReqDTO;
import com.sy.main.dto.LoginRespDTO;
import com.sy.main.dto.RegReqDTO;
import com.sy.main.dto.ResetPasswordDTO;
import com.sy.main.dto.UserRespDTO;
import com.sy.main.repository.RoleRepo;
import com.sy.main.repository.UserRepo;
import com.sy.main.repository.WalletRepo;
import com.sy.main.security.JwtUtil;
import com.sy.main.security.SecurityUtil;
import com.sy.main.service.UserService;

import com.sy.main.Entity.Role;
import com.sy.main.Entity.User;
import com.sy.main.Entity.Wallet;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	private UserRepo ur;
	
	@Autowired
	private RoleRepo rp;
	@Autowired
	private WalletRepo wr;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	
	@Transactional
	@Override
	public UserRespDTO regUser(RegReqDTO req) {
			Optional<User> existingUser=ur.findByEmail(req.getEmail());
			if(existingUser.isPresent()) {
				throw new RuntimeException("Email already exists");
			}
			Optional<Role> role =rp.findByRoleName("USER");
			if(role.isEmpty()) {
				throw new RuntimeException("USER role not found");
			}
			User us= new User();
			us.setFirstName(req.getFirstName());
			us.setLastName(req.getLastName());
			us.setEmail(req.getEmail());
			us.setPassword(passwordEncoder.encode(req.getPassword()));
			us.setPhone(req.getPhone());
			us.setDateOfBirth(req.getDateOfBirth());
			us.setGender(req.getGender());
			us.setRole(role.get());
			us.setStatus("ACTIVE");
			us.setEmailVerified(false);
			
			User saveduser = ur.save(us);

			System.out.println("========== WALLET CREATION DEBUG ==========");
			System.out.println("Created User ID: " + saveduser.getUserId());
			System.out.println("Creating wallet for user: " + saveduser.getEmail());

			Wallet wallet = new Wallet();
			wallet.setUser(saveduser);
			wallet.setWalletNumber("PAY" + System.currentTimeMillis());
			wallet.setBalance(BigDecimal.ZERO);
			wallet.setWalletStatus("ACTIVE");

			Wallet savedWallet = wr.save(wallet);

			System.out.println("Wallet created successfully!");
			System.out.println("Wallet ID: " + savedWallet.getWalletId());
			System.out.println("Wallet User ID: " + savedWallet.getUser().getUserId());
			System.out.println("Wallet Number: " + savedWallet.getWalletNumber());
			System.out.println("==========================================");
		
		UserRespDTO resp= new UserRespDTO();
		resp.setUserId(saveduser.getUserId());
		resp.setFirstName(saveduser.getFirstName());
		resp.setLastName(saveduser.getLastName());
		resp.setEmail(saveduser.getEmail());
		resp.setPhone(saveduser.getPhone());
		resp.setGender(saveduser.getGender());
		resp.setStatus(saveduser.getStatus());
		resp.setEmailVerified(saveduser.getEmailVerified());
			return resp;
	}

	@Override
	public LoginRespDTO  loginUser(LoginReqDTO req) {
			User user= ur.findByEmail(req.getEmail())
					.orElseThrow(()-> new RuntimeException("Invalid email or password"));
			if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
			    throw new RuntimeException("Invalid email or password");
			}
			if (!"ACTIVE".equals(user.getStatus())) {
			    throw new RuntimeException("User account is blocked");
			}
			UserRespDTO useresp= new UserRespDTO();
			useresp.setUserId(user.getUserId());
			useresp.setFirstName(user.getFirstName());
			useresp.setLastName(user.getLastName());
			useresp.setEmail(user.getEmail());
			useresp.setPhone(user.getPhone());
			useresp.setGender(user.getGender());
			useresp.setStatus(user.getStatus());
			useresp.setEmailVerified(user.getEmailVerified());
			
			String token=jwtUtil.generateToken(user.getEmail());
			LoginRespDTO resp= new LoginRespDTO();
			resp.setToken(token);
			resp.setUser(useresp);
			
			return resp;
	}

	@Override
	public UserRespDTO getUserById(Integer userId) {
		User user= ur.findById(userId)
				.orElseThrow(()-> new RuntimeException("User not found"));
		UserRespDTO resp= new UserRespDTO();
		resp.setUserId(user.getUserId());
		resp.setFirstName(user.getFirstName());
		resp.setLastName(user.getLastName());
		resp.setEmail(user.getEmail());
		resp.setPhone(user.getPhone());
		resp.setGender(user.getGender());
		resp.setStatus(user.getStatus());
		resp.setEmailVerified(user.getEmailVerified());
		return resp;
	}

	@Override
	public List<UserRespDTO> getAllUsers() {
		List<User> users= ur.findAll();
		return users.stream().map(user->{
			UserRespDTO resp= new UserRespDTO();
		resp.setUserId(user.getUserId());
		resp.setFirstName(user.getFirstName());
		resp.setLastName(user.getLastName());
		resp.setEmail(user.getEmail());
		resp.setPhone(user.getPhone());
		resp.setGender(user.getGender());
		resp.setStatus(user.getStatus());
		resp.setEmailVerified(user.getEmailVerified());
		return resp;
		}).toList();
		
		
	}

	@Override
	public UserRespDTO updateUser(Integer userId, RegReqDTO request) {
		User user= ur.findById(userId)
				.orElseThrow(()-> new RuntimeException("User not found"));
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhone(request.getPhone());
		user.setDateOfBirth(request.getDateOfBirth());
		user.setGender(request.getGender());
		User updateUser= ur.save(user);
		
		UserRespDTO resp= new UserRespDTO();
		resp.setUserId(updateUser.getUserId());
		resp.setFirstName(updateUser.getFirstName());
		resp.setLastName(updateUser.getLastName());
		resp.setEmail(updateUser.getEmail());
		resp.setPhone(updateUser.getPhone());
		resp.setGender(updateUser.getGender());
		resp.setStatus(updateUser.getStatus());
		resp.setEmailVerified(updateUser.getEmailVerified());
		return resp;
	}

	@Override
	public void deleteUser(Integer userId) {
		User user= ur.findById(userId)
				.orElseThrow(()-> new RuntimeException("User not found"));
		ur.delete(user);
		
	}
	@Override
	public UserRespDTO blockUser(Integer userId) {

	    User user = ur.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    user.setStatus("BLOCKED");

	    User updated = ur.save(user);

	    return convertToUserRespDTO(updated);
	}
	@Override
	public UserRespDTO unblockUser(Integer userId) {

	    User user = ur.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    user.setStatus("ACTIVE");

	    User updated = ur.save(user);

	    return convertToUserRespDTO(updated);
	}
	private UserRespDTO convertToUserRespDTO(User user) {

	    UserRespDTO resp = new UserRespDTO();

	    resp.setUserId(user.getUserId());
	    resp.setFirstName(user.getFirstName());
	    resp.setLastName(user.getLastName());
	    resp.setEmail(user.getEmail());
	    resp.setPhone(user.getPhone());
	    resp.setGender(user.getGender());
	    resp.setStatus(user.getStatus());
	    resp.setEmailVerified(user.getEmailVerified());

	    return resp;
	}
	@Override
	public UserRespDTO getMyProfile() {

	    User user = SecurityUtil.getCurrentUser();

	    return convertToUserRespDTO(user);
	}
	@Override
	public UserRespDTO updateMyProfile(RegReqDTO request) {

	    User user = SecurityUtil.getCurrentUser();

	    if (request.getFirstName() != null) {
	        user.setFirstName(request.getFirstName());
	    }

	    if (request.getLastName() != null) {
	        user.setLastName(request.getLastName());
	    }

	    if (request.getPhone() != null) {
	        user.setPhone(request.getPhone());
	    }

	    if (request.getDateOfBirth() != null) {
	        user.setDateOfBirth(request.getDateOfBirth());
	    }

	    if (request.getGender() != null) {
	        user.setGender(request.getGender());
	    }

	    User updatedUser = ur.save(user);

	    return convertToUserRespDTO(updatedUser);
	}
	@Override
	public void changePassword(ChangePasswordDTO request) {

	    User user = SecurityUtil.getCurrentUser();

	    if (!passwordEncoder.matches(
	            request.getCurrentPassword(),
	            user.getPassword())) {

	        throw new RuntimeException("Current password is incorrect");
	    }

	    if (request.getNewPassword() == null ||
	        request.getNewPassword().isBlank()) {

	        throw new RuntimeException("New password cannot be empty");
	    }

	    if (request.getCurrentPassword()
	            .equals(request.getNewPassword())) {

	        throw new RuntimeException(
	                "New password must be different from current password");
	    }

	    user.setPassword(
	            passwordEncoder.encode(request.getNewPassword())
	    );

	    ur.save(user);
	}
	@Override
	public String forgotPassword(ForgotPasswordDTO request) {

	    User user = ur.findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                new RuntimeException("User not found"));

	    String token = UUID.randomUUID().toString();

	    user.setResetToken(token);

	    user.setResetTokenExpiry(
	            LocalDateTime.now().plusMinutes(15)
	    );

	    ur.save(user);

	    return token;
	}
	@Override
	public void resetPassword(ResetPasswordDTO request) {

	    User user = ur.findByResetToken(request.getToken())
	            .orElseThrow(() ->
	                new RuntimeException("Invalid reset token"));

	    if (user.getResetTokenExpiry() == null ||
	        user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

	        throw new RuntimeException("Reset token expired");
	    }

	    if (request.getNewPassword() == null ||
	        request.getNewPassword().isBlank()) {

	        throw new RuntimeException(
	                "New password cannot be empty");
	    }

	    user.setPassword(
	            passwordEncoder.encode(request.getNewPassword())
	    );

	    user.setResetToken(null);
	    user.setResetTokenExpiry(null);

	    ur.save(user);
	}

	@Override
	public String sendVerificationToken(
	        EmailVerificationDTO request) {

	    User user = ur.findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                new RuntimeException("User not found"));

	    if (Boolean.TRUE.equals(user.getEmailVerified())) {
	        throw new RuntimeException(
	                "Email is already verified");
	    }

	    String token = UUID.randomUUID().toString();

	    user.setVerificationToken(token);

	    user.setVerificationTokenExpiry(
	            LocalDateTime.now().plusMinutes(15)
	    );

	    ur.save(user);

	    return token;
	}
	@Override
	public void verifyEmail(String token) {

	    User user = ur.findByVerificationToken(token)
	            .orElseThrow(() ->
	                new RuntimeException(
	                    "Invalid verification token"));

	    if (user.getVerificationTokenExpiry() == null ||
	        user.getVerificationTokenExpiry()
	            .isBefore(LocalDateTime.now())) {

	        throw new RuntimeException(
	                "Verification token expired");
	    }

	    user.setEmailVerified(true);

	    user.setVerificationToken(null);
	    user.setVerificationTokenExpiry(null);

	    ur.save(user);
	}
}
