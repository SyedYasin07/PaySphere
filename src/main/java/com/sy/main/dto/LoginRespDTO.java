package com.sy.main.dto;

public class LoginRespDTO {

    private String token;
    private UserRespDTO user;
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public UserRespDTO getUser() {
		return user;
	}
	public void setUser(UserRespDTO user) {
		this.user = user;
	}
    
    
}
