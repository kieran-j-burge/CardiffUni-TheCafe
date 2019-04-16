import express from "express";
import { connect, mongoose  } from "mongoose";
import { localURI, mongoURI } from "./config/keys";
import * as bodyParser from "body-parser";
import feedbackRouter from "./routes/api/feedback";
import resourcesRouter from "./routes/api/resources";
import moduleRouter from "./routes/api/module";
import studentRouter from "./routes/api/student";
import adminRouter from "./routes/api/admin";
import actionPlanRouter from "./routes/api/actionPlan"
import skillsRouter from "./routes/api/skills";
import assessmentRouter from "./routes/api/assessment";
import simsModuleRouter from "./routes/api/simsModule";


const app = express();

// Bodyparse middleware
app.use(bodyParser.json());

//  Connect to Mongo
connect(mongoURI)
  .then(() => console.log("Mongo DB connected..."))
  .catch(err => console.log(err));

// Use Routes
app.use("/api/feedback", feedbackRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/module", moduleRouter);
app.use("/api/student", studentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/skills", skillsRouter)
app.use("/api/actionPlan", actionPlanRouter)
app.use("/api/assessment", assessmentRouter);
app.use("/api/simsModule", simsModuleRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
