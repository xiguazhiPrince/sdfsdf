export default {
  createDB_And_InitTables: createDB_And_InitTables,
  insertOrUpdateData: insertOrUpdateData,
  listDataByPage: listDataByPage
}

const dbInfo = {
  // 名称
  dbName: "customer2",
  // 版本
  dbVersion: 3
};

let db;
let indexedDB;

let isUpdateVersion;

function getIndexedDBObject(){

  indexedDB = window.indexedDB || window.webkitindexedDB || window.msIndexedDB || mozIndexedDB;

  if ('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
  }
}

function createDB_And_InitTables(objectStores, successCallBack, failedCallback) {
  getIndexedDBObject();

  if (!objectStores || objectStores.length === 0){
    return;
  }

  let request = indexedDB.open(dbInfo.dbName, dbInfo.dbVersion);

  request.onblocked = function(event) {
    // 如果其他的一些页签加载了该数据库，在我们继续之前需要关闭它们
    alert("请关闭其他由该站点打开的页签！");
  };

  request.onupgradeneeded = function (event) { // 第一次打开
    db = event.target.result;

    console.info('第一次打开或数据库升级...', event);

    db.onerror = function(event2) {
      console.info('数据库升级过程中报错...', event2);
    };
    // onupgradeneeded 是我们唯一可以修改数据库结构的地方, 在这里面，我们可以创建和删除对象存储空间以及构建和删除索引。
    createObjectStore(objectStores)
    useDatabase(db)
  };

  request.onsuccess = function (event) { // 打开数据库成功
    console.info('链接成功...', event, db);
    db = event.target.result;

    successCallBack(event);

    useDatabase(db)

    db.onerror = function(event2) {
      console.info('链接成功中报错...', event2);
    };
  };

  request.onerror = function (e) {
    console.error("链接失败..." , e);
    failedCallback();
  };
}

function useDatabase(db) {
  // 当由其他页签请求了版本变更时，确认添加了一个会被通知的事件处理程序。
  // 这里允许其他页签来更新数据库，如果不这样做，版本升级将不会发生知道用户关闭了这些页签。
  db.onversionchange = function(event) {
    db.close();
    alert("A new version of this page is ready. Please reload or close this tab!");
  };

  // 处理数据库
}

function createObjectStore(objectStores) {
    //onupgradeneeded 是我们唯一可以修改数据库结构的地方,在这里面，我们可以创建和删除对象存储空间以及构建和删除索引。
    if (typeof objectStores === "string") {
      if (!db.objectStoreNames.contains(objectStores)) {
        // db.deleteObjectStore("ShoppingCart");
        let objectStore = db.createObjectStore(objectStores, {keyPath: "mobile"});
        objectStore.createIndex("idNumber", "idNumber", { unique: true });

        // 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
        objectStore.transaction.oncomplete = function(event) {
          console.log('创建表成功', objectStore, event)
        };
        objectStore.transaction.onerror = function(event) {
          console.warn('创建表失败', objectStore, event)
        };
      }else{
        console.log('表存在')
      }
    }
    // if (objectStores instanceof Array) {
    //   for (let i = 0; i < objectStores.length; i++) {
    //     if (!db.objectStoreNames.contains(objectStores[i])) {
    //       // db.deleteObjectStore("ShoppingCart");
    //       let objectStore = db.createObjectStore(objectStores[i], {keyPath: "mobile"});
    //     }
    //   }
    // }
}

//插入或更新数据
function insertOrUpdateData(data, objectStoreName, successCallBack, failedCallback) {

  if (!data || !objectStoreName){
    return false;
  }

  data.systemUpdateTime = new Date();

  console.log('db', db);

  let trans = db.transaction([objectStoreName], 'readwrite');
  let store = trans.objectStore(objectStoreName);
  let request = store.put(data);
  request.onsuccess = successCallBack;
  request.onerror = failedCallback;
}

function add_data(data, objectStoreName, successCallBack, failedCallback){

  // 处理数据的公共字段
  data.systemUpdateTime = new Date();

  //2-返回一个事务对象,indexDB 数据库只有  readwrite 以及readonly两个可爱的状态。
  let transaction = db.transaction([objectStoreName], "readwrite");
      // 在所有数据添加完毕后的处理
      transaction.oncomplete = function(event) {
        console.info("添加数据完成");
      };
      transaction.onerror = function(event) {
        console.warn("添加数据失败");
      };

  //3-objectStore方法用于返回指定的对象仓库(数据库表格)对象。
  let objectStore  =  transaction.objectStore(objectStoreName);

  //5-添加数据：add方法的第一个参数是所要添加的数据，第二个参数是这条数据对应的键名（key）
  let request = objectStore.add(data);
      //6-添加数据：add方法也有两个事件，一个error一个success可以在回调函数中调用。
      request.onerror = function(e) {
        console.warn("数据添加失败...", e.target.error.name);
        failedCallback(e)
      };
      request.onsuccess = function(e) {
        // event.target.result === customer.ssn; 返回的是主键
        console.log("数据添加成功...", e);
        successCallBack(e)
      }
}


function del_data_by_id(id, objectStoreName, successCallBack, failedCallback){
  var request = db.transaction([objectStoreName], "readwrite")
    .objectStore(objectStoreName)
    .delete(id);
  request.onsuccess = function(event) {
    console.log("删除成功...", e);
    successCallBack(event)
  };
  request.onerror = function(e) {
    console.warn("数据添加失败...", e.target.error.name);
    failedCallback(e)
  };
}


function get_data_by_id(id, objectStoreName, successCallBack, failedCallback){
  // 默认读的事务
  var transaction = db.transaction([objectStoreName]);
  var objectStore = transaction.objectStore(objectStoreName);
  var request = objectStore.get(id);
  request.onsuccess = function(event) {
    console.log("请求成功...", e);
    successCallBack(event)
  };
  request.onerror = function(e) {
    console.warn("请求失败...", e.target.error.name);
    failedCallback(e)
  };
}


// 分页加载数据
function listDataByPage(objectStoreName, successCallBack, pageIndex, pageSize ) {

  if (!objectStoreName){
    return false;
  }

  let trans = db.transaction([objectStoreName], 'readwrite');
  let objectStore = trans.objectStore(objectStoreName);

  let cursorOperator = objectStore.openCursor();
  let list = [];
  let total = 0;
  cursorOperator.onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        list.push(cursor.value);
        total ++;
        cursor.continue();
      } else {
      }
      return successCallBack(list, total);
  };
}
