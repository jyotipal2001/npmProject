const http=require("http");
const fs=require("fs");
var requests=require("requests");
const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,origVal)=>{
let temperature=tempVal.replace("{%tempval%}",origVal.main.temp);
temperature=temperature.replace("{%tempmax%}",origVal.main.temp_min);
temperature=temperature.replace("{%tempmin%}",origVal.main.temp_max);
temperature=temperature.replace("{%location%}",origVal.name);
temperature=temperature.replace("{%country%}",origVal.sys.country);
temperature=temperature.replace("{%tempstatus%}",origVal.weather[0].main);

return temperature;
};
const server=http.createServer((req,res)=>{
if(req.url=="/"){
    requests("api.openweathermap.org/data/2.5/weather?q=pune&appid=054b4416915e6ebb175505691e192af0")
    .on("data",(chunk)=>{
        const objdata=JSON.parse(chunk);
        const arrData=[objdata];
       const realTimeData=arrData.map(val=> replaceVal(homeFile,val)).join("");
       res.write(realTimeData);
    })
    .on("end",(err)=>{
        if(err) return console.log("connection closed due to error",err);
        res.end();
    });
}
});
server.listen(3000,"127.0.0.1");