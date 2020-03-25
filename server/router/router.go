package router

import (
	"../middleware"
	"github.com/gorilla/mux"
)

func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/api/user", middleware.CreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/deleteuser", middleware.DeleteUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/service", middleware.CreateService).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/login", middleware.LoginUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/logout", middleware.LogoutUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/users", middleware.GetAllUsers).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/customers", middleware.GetAllCustomers).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/serviceproviders", middleware.GetAllServiceProviders).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/services", middleware.GetAllServices).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/myservices", middleware.GetAllMyServices).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/otherservices", middleware.GetAllOtherServices).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/profilepicture", middleware.UpdateProfilePicture).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/personalinformation", middleware.UpdatePersonalInformation).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/updatepassword", middleware.UpdatePassword).Methods("PUT", "OPTIONS")
	return router
}
