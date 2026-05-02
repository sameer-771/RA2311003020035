import { Log } from "./index.js";
async function test() {
    await Log("frontend", "info", "utils", "Logging middleware test successful");
}
test();
