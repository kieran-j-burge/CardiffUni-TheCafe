import { Schema, model } from "mongoose";

  const adminSchema = new Schema({
	name: {
	  type: String,
	  required: true
	},
	email: {
	  type: String,
	  required: true,
	  unique: true
	},

	password: {
	  type: String,
	  required: true
	},
	

  });
  
  const Admin = model("admin", adminSchema);
  
  export default Admin;