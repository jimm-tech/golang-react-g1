package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"../models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DB connection string
const connectionString = "mongodb://localhost:27017"

// Database Name
const dbName = "mnm"

// Collection name
const userCollName = "users"
const servicesCollName = "services"
const ratingsCollName = "ratings"
const requestsCollName = "requests"

// collection object/instance
var usersCollection *mongo.Collection
var servicesCollection *mongo.Collection
var ratingsCollection *mongo.Collection
var requestsCollection *mongo.Collection

// create connection with mongo db
func init() {

	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	usersCollection = client.Database(dbName).Collection(userCollName)
	servicesCollection = client.Database(dbName).Collection(servicesCollName)
	ratingsCollection = client.Database(dbName).Collection(ratingsCollName)
	requestsCollection = client.Database(dbName).Collection(requestsCollName)

	// Create Admin credentials
	var admin models.User
	byteValues, err := ioutil.ReadFile("admin_data.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(byteValues, &admin)
	filter := bson.M{"type": bson.M{"$eq": admin.Type}}
	count, _ := usersCollection.CountDocuments(context.Background(), filter)
	if count < 1 {
		_, err = usersCollection.InsertOne(context.Background(), admin)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("MNM Admin created!")
	}
}

// GetAllUsers get all the users route
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	users := getAllUsers()
	json.NewEncoder(w).Encode(users)
}

// GetAllCustomers get all the customers route
func GetAllCustomers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	customers := getAllCustomers()
	json.NewEncoder(w).Encode(customers)
}

// GetAllServiceProviders get all the service providers route
func GetAllServiceProviders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	serviceproviders := getAllServiceProviders()
	json.NewEncoder(w).Encode(serviceproviders)
}

// GetAllServices get all the services route
func GetAllServices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	services := getAllServices()
	json.NewEncoder(w).Encode(services)
}

// GetAllMyServices get all the services by userid route
func GetAllMyServices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var service models.Service
	_ = json.NewDecoder(r.Body).Decode(&service)
	json.NewEncoder(w).Encode(getAllMyServices(service))
}

// GetAllOtherServices get all the other services route
func GetAllOtherServices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var otherservices models.Service
	_ = json.NewDecoder(r.Body).Decode(&otherservices)
	json.NewEncoder(w).Encode(getAllOtherServices(otherservices))
}

// CreateUser create user route
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	createUser(user)
	json.NewEncoder(w).Encode(user)
}

// CreateService create service route
func CreateService(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var service models.Service
	_ = json.NewDecoder(r.Body).Decode(&service)
	createService(service)
	json.NewEncoder(w).Encode(service)
}

// LoginUser login user route
func LoginUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var credential models.UserCredential
	_ = json.NewDecoder(r.Body).Decode(&credential)
	json.NewEncoder(w).Encode(loginUser(credential))
}

// LogoutUser logout user route
func LogoutUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	json.NewEncoder(w).Encode(logoutUser(user))
}

// UpdatePersonalInformation update user's personal information route
func UpdatePersonalInformation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	json.NewEncoder(w).Encode(updatePersonalInformation(user))
}

// UpdateProfilePicture update user's profile picture route
func UpdateProfilePicture(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	json.NewEncoder(w).Encode(updateProfilePicture(user))
}

// UpdatePassword update user's password route
func UpdatePassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var userPassword models.UserPassword
	_ = json.NewDecoder(r.Body).Decode(&userPassword)
	json.NewEncoder(w).Encode(updatePassword(userPassword))
}

// get all users from the DB and return it
func getAllUsers() []primitive.M {
	cur, err := usersCollection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// get all customers from the DB and return it
func getAllCustomers() []primitive.M {
	projection := bson.D{
		primitive.E{Key: "_id", Value: 1},
		primitive.E{Key: "firstname", Value: 1},
		primitive.E{Key: "lastname", Value: 1},
		primitive.E{Key: "image", Value: 1},
		primitive.E{Key: "status", Value: 1},
		primitive.E{Key: "type", Value: 1},
		primitive.E{Key: "deleted", Value: 1},
		primitive.E{Key: "email", Value: 1},
	}
	findFilter := bson.M{"type": "Customer"}
	cur, err := usersCollection.Find(context.Background(),
		findFilter, options.Find().SetProjection(projection))
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// get all service providers from the DB and return it
func getAllServiceProviders() []primitive.M {
	projection := bson.D{
		primitive.E{Key: "_id", Value: 1},
		primitive.E{Key: "firstname", Value: 1},
		primitive.E{Key: "lastname", Value: 1},
		primitive.E{Key: "image", Value: 1},
		primitive.E{Key: "status", Value: 1},
		primitive.E{Key: "type", Value: 1},
		primitive.E{Key: "deleted", Value: 1},
		primitive.E{Key: "email", Value: 1},
	}
	findFilter := bson.M{"type": "Service Provider"}
	cur, err := usersCollection.Find(context.Background(),
		findFilter, options.Find().SetProjection(projection))
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// get all services from the DB and return it
func getAllServices() []primitive.M {

	lookup := bson.D{
		primitive.E{Key: "$lookup", Value: bson.D{
			primitive.E{Key: "from", Value: "users"},
			primitive.E{Key: "localField", Value: "userid"},
			primitive.E{Key: "foreignField", Value: "_id"},
			primitive.E{Key: "as", Value: "service_provider"},
		}},
	}

	unwind := bson.D{
		primitive.E{Key: "$unwind", Value: bson.D{
			primitive.E{Key: "path", Value: "$userid"},
			primitive.E{Key: "preserveNullAndEmptyArrays", Value: false},
		}},
	}

	cur, err := servicesCollection.Aggregate(context.Background(),
		mongo.Pipeline{lookup, unwind})
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// get all services by userid from the DB and return it
func getAllMyServices(service models.Service) []primitive.M {
	findFilter := bson.M{"userid": bson.M{"$eq": service.UserID}}
	cur, err := servicesCollection.Find(context.Background(), findFilter)
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// get all other services from the DB and return it
func getAllOtherServices(service models.Service) []primitive.M {
	filter := bson.D{
		primitive.E{Key: "$match", Value: bson.D{
			primitive.E{Key: "userid", Value: bson.M{"$ne": service.UserID}},
		}},
	}

	lookup := bson.D{
		primitive.E{Key: "$lookup", Value: bson.D{
			primitive.E{Key: "from", Value: "users"},
			primitive.E{Key: "localField", Value: "userid"},
			primitive.E{Key: "foreignField", Value: "_id"},
			primitive.E{Key: "as", Value: "service_provider"},
		}},
	}

	unwind := bson.D{
		primitive.E{Key: "$unwind", Value: bson.D{
			primitive.E{Key: "path", Value: "$userid"},
			primitive.E{Key: "preserveNullAndEmptyArrays", Value: false},
		}},
	}

	cur, err := servicesCollection.Aggregate(context.Background(),
		mongo.Pipeline{lookup, unwind, filter})
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// Login user in the DB
func loginUser(credential models.UserCredential) models.User {
	projection := bson.D{
		primitive.E{Key: "_id", Value: 1},
		primitive.E{Key: "firstname", Value: 1},
		primitive.E{Key: "lastname", Value: 1},
		primitive.E{Key: "image", Value: 1},
		primitive.E{Key: "status", Value: 1},
		primitive.E{Key: "type", Value: 1},
		primitive.E{Key: "deleted", Value: 1},
		primitive.E{Key: "email", Value: 1},
	}
	findFilter := bson.M{
		"email":    credential.Email,
		"password": credential.Password,
		"deleted":  false,
		"status":   false,
	}
	var result models.User
	err := usersCollection.FindOne(context.Background(),
		findFilter, options.FindOne().SetProjection(projection)).Decode(&result)

	if err != nil {
		fmt.Println(err)
		return result
	}

	updateFilter := bson.M{"_id": bson.M{"$eq": result.ID}}
	update := bson.M{"$set": bson.M{"status": true}}
	updateResult, err := usersCollection.UpdateOne(context.TODO(), updateFilter, update)

	if err != nil {
		fmt.Println(err)
		return result
	}

	fmt.Printf("User logged in: %v (%v)\n", result, updateResult.ModifiedCount)
	return result
}

// Logout user in the DB
func logoutUser(user models.User) bool {
	filter := bson.M{"_id": bson.M{"$eq": user.ID}}
	var result models.User
	err := usersCollection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		fmt.Println(err)
		return false
	}

	update := bson.M{"$set": bson.M{"status": false}}
	updateResult, err := usersCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		fmt.Println(err)
		return false
	}

	fmt.Printf("User logged out: %v (%v)\n", result.ID, updateResult.ModifiedCount)
	return true
}

// Update user's password in the DB
func updatePassword(userPassword models.UserPassword) models.ServerResponse {
	var response models.ServerResponse

	filter := bson.M{"_id": bson.M{"$eq": userPassword.UserID}}
	update := bson.M{"$set": bson.M{"password": userPassword.Old}}

	updateResult, err := usersCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		fmt.Println(err)

		response.Success = false
		response.Message = "Something went wrong."

		return response
	}

	var result models.User
	_ = usersCollection.FindOne(context.Background(), filter).Decode(&result)

	fmt.Printf("User profile picture updated: %v (%v)\n", result.ID, updateResult.ModifiedCount)

	response.Success = true
	response.Message = "Successfully updated."
	response.Data = result.Image

	return response
}

// Update user's profile picture in the DB
func updateProfilePicture(user models.User) models.ServerResponse {
	var response models.ServerResponse

	filter := bson.M{"_id": bson.M{"$eq": user.ID}}
	update := bson.M{"$set": bson.M{"image": user.Image}}

	updateResult, err := usersCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		fmt.Println(err)

		response.Success = false
		response.Message = "Something went wrong."

		return response
	}

	var result models.User
	_ = usersCollection.FindOne(context.Background(), filter).Decode(&result)

	fmt.Printf("User profile picture updated: %v (%v)\n", result.ID, updateResult.ModifiedCount)

	response.Success = true
	response.Message = "Successfully updated."
	response.Data = result.Image

	return response
}

// Update user's personal information in the DB
func updatePersonalInformation(user models.User) models.ServerResponse {
	var response models.ServerResponse

	filter := bson.M{"_id": bson.M{"$eq": user.ID}}
	update := bson.M{"$set": bson.M{
		"email":     user.Email,
		"firstname": user.FirstName,
		"lastname":  user.LastName,
	}}

	updateResult, err := usersCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		fmt.Println(err)

		response.Success = false
		response.Message = "Something went wrong."

		return response
	}

	var result models.User
	_ = usersCollection.FindOne(context.Background(), filter).Decode(&result)

	fmt.Printf("User personal information updated: %v (%v)\n", result.ID, updateResult.ModifiedCount)

	response.Success = true
	response.Message = "Successfully updated."
	response.UserData = result

	return response
}

// Create one user in the DB
func createUser(user models.User) {
	insertResult, err := usersCollection.InsertOne(context.Background(), user)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("User created: ", insertResult.InsertedID)
}

// Create one service in the DB
func createService(service models.Service) {
	insertResult, err := servicesCollection.InsertOne(context.Background(), service)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Service created: ", insertResult.InsertedID)
}
