package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Email     string             `json:"email,omitempty"`
	Password  string             `json:"password,omitempty"`
	FirstName string             `json:"firstname,omitempty"`
	LastName  string             `json:"lastname,omitempty"`
	Type      string             `json:"type,omitempty"`
	Status    bool               `json:"status,omitempty"`
	Deleted   bool               `json:"deleted,omitempty"`
	Image     string             `json:"image,omitempty"`
}

type Service struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	UserID      primitive.ObjectID `json:"userid,omitempty" bson:"userid,omitempty"`
	Title       string             `json:"title,omitempty"`
	Description string             `json:"description,omitempty"`
	Price       string             `json:"price,omitempty"`
	Timestamp   time.Time          `json:"timestamp,omitempty" bson:"timestamp,omitempty"`
	Image       string             `json:"image,omitempty"`
}

type Request struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	ServiceID primitive.ObjectID `json:"serviceid,omitempty" bson:"serviceid,omitempty"`
	UserID    primitive.ObjectID `json:"userid,omitempty" bson:"userid,omitempty"`
	Timestamp time.Time          `json:"timestamp,omitempty" bson:"timestamp,omitempty"`
}

type Rating struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	UserID primitive.ObjectID `json:"userid,omitempty" bson:"userid,omitempty"`
	One    int                `json:"one,omitempty"`
	Two    int                `json:"two,omitempty"`
	Three  int                `json:"three,omitempty"`
	Four   int                `json:"four,omitempty"`
	Five   int                `json:"five,omitempty"`
}

type ServerResponse struct {
	Success  bool   `json:"success,omitempty"`
	Message  string `json:"message,omitempty"`
	Data     string `json:"data,omitempty"`
	UserData User   `json:"userdata,omitempty"`
}

type UserCredential struct {
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

type UserPassword struct {
	UserID primitive.ObjectID `json:"userid,omitempty" bson:"userid,omitempty"`
	Old    string             `json:"old,omitempty"`
	New    string             `json:"new,omitempty"`
}
