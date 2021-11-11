const express = require("express");
const mongoose = require("mongoose");
const supertest = require("supertest");
const dotenv = require("dotenv");
const colors = require("colors");

const User = require("./src/models/User");

dotenv.config();

beforeEach((done) => {
    mongoose.connect(
        "mongodb://localhost:27017/dbSuperTest",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done()
    );
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  const userRoutes = require("./src/routes/users");

  const app = express();

  app.use(express.json());

  const versionOne = (routeName) => `/api/v1/${routeName}`;
  
  app.use(versionOne("users"), userRoutes);

  test("GET /api/v1/users", async () => {

    const user = await User.create({
        idEmp: "User 2",
        name: "Lorem name2",
        firstName: "Lorem firstName2",
        dateCreated: "2021-11-04T13:22:14.285Z",
        department: "Lorem department",
    });
  
    await supertest(app)
      .get("/api/v1/users")
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toEqual(1);
  
        // Check the response data
        expect(response.body.data[0]._id).toBe(user.id);
        expect(response.body.data[0].idEmp).toBe(user.idEmp);
        expect(response.body.data[0].name).toBe(user.name);
        expect(response.body.data[0].firstName).toBe(user.firstName);
        expect(new Date(response.body.data[0].dateCreated).getTime()).toEqual(+user.dateCreated);
        expect(response.body.data[0].department).toBe(user.department);
      });
  });

  test("POST /api/v1/users", async () => {
    const data = {
      idEmp: "User 3",
      name: "Lorem name3",
      firstName: "Lorem firstName3",
      dateCreated: "2021-11-04T13:22:14.285Z",
      department: "INFORMATIQUE",
    };
  
    await supertest(app)
      .post("/api/v1/users")
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.idEmp).toBe(data.idEmp);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.firstName).toBe(data.firstName);
        expect(response.body.data.department).toBe(data.department);
        expect(new Date(response.body.data.dateCreated).getTime())
        .toEqual(Date.parse(data.dateCreated));
  
        // Check the data in the database
        const user = await User.findOne({ _id: response.body.data._id });
        expect(user).toBeTruthy();
        expect(user.idEmp).toBe(data.idEmp);
        expect(user.name).toBe(data.name);
        expect(user.firstName).toBe(data.firstName);
        expect(user.department).toBe(data.department);
        expect(new Date(user.dateCreated).getTime())
        .toEqual(Date.parse(data.dateCreated));
      });
  });

  test("PUT /api/v1/users/:id", async () => {
    const user = await User.create({
      idEmp: "User 1",
      name: "Lorem name",
      firstName: "Lorem firstName1",
      dateCreated: "2021-11-04T13:22:14.285Z",
      department: "INFORMATIQUE",
    });
  
    const data = {
      idEmp: "User 1",
      name: "new Lorem name 3",
      firstName: "new Lorem firstName 3",
      department: "Mathematique",
      dateCreated: "2021-11-10T21:29:22.821Z",
    };
  
    await supertest(app)
      .put("/api/v1/users/" + user.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.idEmp).toBe(data.idEmp);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.firstName).toBe(data.firstName);
        expect(response.body.data.department).toBe(data.department);
        expect(new Date(response.body.data.dateCreated).getTime())
        .toEqual(Date.parse(data.dateCreated));
  
        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.idEmp).toBe(data.idEmp);
        expect(newUser.name).toBe(data.name);
        expect(newUser.firstName).toBe(data.firstName);
        expect(newUser.department).toBe(data.department);
        expect(new Date(newUser.dateCreated).getTime())
        .toBe(Date.parse(data.dateCreated));
      });
  });

  test("GET /api/v1/users/departments", async () => {

    const user = await User.create({
        idEmp: "User 4",
        name: "Lorem name 4",
        firstName: "Lorem firstName 4",
        dateCreated: "2021-11-04T13:22:14.285Z",
        department: "Physique",
    });
  
    await supertest(app)
      .get("/api/v1/users/departments")
      .query({ department: 'Physique' })
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toEqual(1);
        // Check the response data
        expect(response.body.data[0]._id).toBe(user.id);
        expect(response.body.data[0].idEmp).toBe(user.idEmp);
        expect(response.body.data[0].name).toBe(user.name);
        expect(response.body.data[0].firstName).toBe(user.firstName);
        expect(new Date(response.body.data[0].dateCreated).getTime()).toEqual(+user.dateCreated);
        expect(response.body.data[0].department).toBe(user.department);
      });
  });
