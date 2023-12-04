let express = require("express");
const { redirect } = require("express/lib/response");
let router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  createRequest,
} = require("../db/dbConnector_Mongo.js");

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    console.log("Got request for /");
    const users = await getUsers();
    res.render("index", {
      users,
      err: "",
      type: "success",
    });
  } catch (exception) {
    console.log("Error execution SQL", exception);
    res.render("index", {
      title: "Apartment Maintenance App",
      users: [],
      err: `Error execution SQL ${exception}`,
      type: "danger",
    });
  }
});

/* Render Edit page. */
router.get("/users/:user_id/edit", async function (req, res) {
  console.log("Edit route", req.params.user_id);
  try {
    const sqlRes = await getUserById(req.params.user_id);
    console.log("users edit found user", sqlRes);
    if (sqlRes.length === 1) {
      res.render("users_edit", { user: sqlRes[0], err: null, type: "success" });
    } else {
      res.render("users_edit", {
        user: null,
        err: "Error finding User " + req.params.user_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      user: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Actually edits a User in table
router.post("/users/:user_id/edit", async function (req, res) {
  console.log("Edit route", req.params.user_id, req.body);

  const user_id = req.params.user_id;
  const newUser = req.body;

  try {
    const sqlResUpdate = await updateUser(user_id, newUser);
    console.log("Updating user", sqlResUpdate);
    if (sqlResUpdate.modifiedCount >= 1) {
      const sqlResFind = await getUserById(req.params.user_id);
      res.render("users_edit", {
        user: sqlResFind[0],
        err: "User modified",
        type: "success",
      });
    } else {
      res.render("users_edit", {
        user: null,
        err: "Error Updating User " + req.params.user_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      user: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Delete a user
router.get("/users/:user_id/delete", async function (req, res) {
  console.log("Delete route", req.params.user_id);

  try {
    const sqlResDelete = await deleteUser(req.params.user_id);
    console.log("Delete user res=", sqlResDelete);
    const users = await getUsers();

    if (sqlResDelete) {
      res.render("index", { users, err: "User deleted", type: "success" });
    } else {
      res.render("index", {
        users,
        err: "Error deleting user",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      users,
      err: "Error executing SQL",
      type: "danger",
    });
  }
});

// Render Create User page
router.get("/users/create", async function (req, res) {
  console.log("Create route", req.params.user_id);

  res.render("users_create", { err: null, type: "success" });
});

// Actually creates User
router.post("/users/create", async function (req, res) {
  console.log("Create route", req.body);

  const newUser = req.body;

  try {
    const sqlResCreate = await createUser(newUser);
    console.log("Updating user", sqlResCreate);
    const users = await getUsers();
    res.redirect("/");
    if (sqlResCreate.changes === 1) {
      res.render("index", {
        users,
        err: "User Created " + sqlResCreate.lastID,
        type: "success",
      });
    } else {
      res.render("users_create", {
        err: "Error inserting user",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("index", {
      users: null,
      err: "Error inserting user" + exception,
      type: "danger",
    });
  }
});

// *********** REQUESTS *********** //

/* GET requests page. */
router.get("/requests", async function (req, res) {
  console.log("Got requests page");

  const requests = await getRequests();

  //console.log("got requests", requests);

  res.render("requests", { requests, err: null, type: "success" });
});

/* Render request edit page. */
router.get("/requests/:request_id/edit", async function (req, res) {
  console.log("Edit route", req.params.request_id);

  const sqlRes = await getRequestById(req.params.request_id);
  console.log("request edit found request", sqlRes);

  res.render("requests_edit", {
    request: sqlRes[0],
    err: null,
    type: "success",
  });
});

// Actually edits a Request in table
router.post("/requests/:request_id/edit", async function (req, res) {
  console.log("Edit route", req.params.request_id, req.body);

  const request_id = req.params.request_id;
  const newRequest = req.body;

  try {
    const sqlResUpdate = await updateRequest(request_id, newRequest);
    console.log("Updating request", sqlResUpdate);

    if (sqlResUpdate.changes === 1) {
      const sqlResFind = await getRequestById(req.params.request_id);
      res.render("requests_edit", {
        request: sqlResFind[0],
        err: "Request modified",
        type: "success",
      });
    } else {
      res.render("requests_edit", {
        request: null,
        err: "Error Updating Request " + req.params.request_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("requests", {
      request: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Delete a Request
router.get("/requests/:request_id/delete", async function (req, res) {
  console.log("Delete route", req.params.user_id);

  try {
    const sqlResDelete = await deleteRequest(req.params.request_id);
    console.log("Delete request result=", sqlResDelete);
    const requests = await getRequests();

    if (sqlResDelete.changes === 1) {
      res.render("requests", {
        requests,
        err: "Request deleted",
        type: "success",
      });
    } else {
      res.render("requests", {
        requests,
        err: "Error deleting request",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("requests", {
      requests,
      err: "Error executing SQL",
      type: "danger",
    });
  }
});

// Render Create Request page
router.get("/requests/create", async function (req, res) {
  console.log("Create route", req.params.request_id);

  res.render("requests_create", { err: null, type: "success" });
});

// Actually creates Request
router.post("/requests/create", async function (req, res) {
  console.log("Create route", req.body);

  const newRequest = req.body;

  try {
    const sqlResCreate = await createRequest(newRequest);
    console.log("Creating request", sqlResCreate);
    const requests = await getRequests();

    if (sqlResCreate.changes === 1) {
      res.render("requests", {
        requests,
        err: "Request Created " + sqlResCreate.lastID,
        type: "success",
      });
    } else {
      res.render("requests_create", {
        err: "Error inserting request",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error executing SQL", exception);
    res.render("requests", {
      requests: null,
      err: "Error creating request" + exception,
      type: "danger",
    });
  }
});

module.exports = router;
