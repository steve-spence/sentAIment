import express from "express";
import cors from "cors";
import { json } from "body-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(json());

app.use('/api', )


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});