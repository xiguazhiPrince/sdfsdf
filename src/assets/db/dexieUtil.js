import Dexie from 'dexie';

const dbName = 'dexieCustom';
const tableName = 'customer_info';
const dbVersion = 1;

const db = new Dexie(dbName);
db.version(dbVersion).stores({
  customer_info: 'mobile, &idNumber, systemUpdateTime, systemCreateTime'
});

function add(config) {
  // if (config.data || config.onSuccess || config.onerror || config.complete) {
  //  校验参数
  //   return
  // }

  let data = config.data;
  data.systemCreateTime = data.systemUpdateTime = new Date();

  db.table(tableName).put(data).then (async function(){
    let result = await db.table(tableName).get(data.mobile);
    config.onSuccess(result);
  }).catch(function(error) {
    config.onerror(error)
  }).finally(()=>{
    config.complete()
  })
}

function del(data) {

}

function update(data) {

}

async function findByMobile(mobile) {
  let result = await db.table(tableName).get(mobile);
  return result;
}

async function findByIdNumber(idNumber) {
  return await db.table(tableName).where("idNumber").equals(idNumber).first();
}

async function list(pageIndex, pageSize) {
  const list = await db.table(tableName).orderBy('systemUpdateTime')
    .offset((pageIndex - 1) * pageSize).limit(pageSize)
    .toArray();

  const total = await db.table(tableName).orderBy('systemUpdateTime').count();

  return {
    list: list,
    total: total
  }
}

export default {
  add: add,
  list: list,
  findByMobile: findByMobile,
  findByIdNumber: findByIdNumber
};
