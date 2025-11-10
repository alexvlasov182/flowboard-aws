package auth

type RegisterInput struct {
	Name     string `json:"name" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse — retrurned after successful authentication
type AuthResponse struct {
	User  interface{} `json:"user"`
	Token string      `json:"token"`
}
