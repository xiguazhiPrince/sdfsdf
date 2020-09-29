
// import initSqlJs from "sql.js";
const path = require('path');
const fs = require('fs');
const wasm = path.join(__dirname, '../js/sql-wasm.wasm');

var initSqlJs = require('../js/sql-wasm.js')

var db;

var config = {
  // 指定加载sql-wasm.wasm文件的位置
  locateFile: filename => wasm
};
initSqlJs(config).then(function(SQL){
  // Load the db
  db = new SQL.Database();
  console.log('sqljs链接', db)
  // test();
}).catch((res)=>{
  console.log('sqljs链接异常', res)
});


function test() {

  // Execute some sql
  let sqlstr = "CREATE TABLE hello (a int, b char);";
  sqlstr += "INSERT INTO hello VALUES (0, 'hello');";
  sqlstr += "INSERT INTO hello VALUES (1, 'world');";
  db.run(sqlstr); // Run the query without returning anything

  var res = db.exec("SELECT * FROM hello");
  /*
   * [{columns:['a','b'], values:[[0,'hello'],[1,'world']]}]
   */

// Prepare an sql statement
  var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

// Bind values to the parameters and fetch the results of the query
  var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
  console.log(result); // Will print {a:1, b:'world'}


  // 注意：上面的增、改、删都只是对载入内存中的数据进行变更，我们需要把内存中的数据再存入磁盘文件中，不然一切皆枉然。
  var data = db.export();
  var buffer = Buffer.from(data, 'binary');
  fs.writeFileSync("D:\\234.sqlite", buffer);
  fs.writeFileSync("234.sqlite", buffer);

}
