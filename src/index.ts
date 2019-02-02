import AppTasksApi from './AppTasksApi'

const port =  8888
const app = new AppTasksApi();
app.express.listen(port, (err:any) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`Tasks Api server is listening on ${port}`)
})