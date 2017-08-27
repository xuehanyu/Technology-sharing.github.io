var express = require('express');

var router = express.Router();

var chinaArea=require('../china_area.json');
router.get('/getProvinces',function (req,res,next) {
  var provinceArr=chinaArea.provinces;
  res.send(provinceArr);
});

router.get('/getCities',function (req,res,next) {
  //获取请求参数
  var provinceId=req.query.provinceId;
  var cityArr=chinaArea.cities;
  var citys=[];
  cityArr.forEach(function (city,index) {
    if(city.parent===provinceId ||city.id===provinceId){
      citys.push(city)
    }
  });
  res.send(citys)
});

router.get('/getCounties',function (req,res,next) {
  // 获取参数
  var citiesId=req.query.citiesId;
  var countiesArr=chinaArea.counties;
  var county=[];
  countiesArr.forEach(function (counties,index) {
    if(counties.parent===citiesId){
      county.push(counties)
    }
  });
  res.send(county)
})



//注册跨域的路由




module.exports = router;
