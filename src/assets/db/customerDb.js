export default {
  createDB_And_InitTables: createDB_And_InitTables,
  insertOrUpdateData: insertOrUpdateData,
  listDataByPage: listDataByPage
}

const dbInfo = {
  // 名称
  dbName: "customer2",
  // 版本
  dbVersion: 2
};

let db;
let indexedDB;

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

  request.onsuccess = function (event) {
    console.info('链接成功...', event);
    db = event.target.result;
    createObjectStore(successCallBack, objectStores)
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    console.info('数据库升级...', event);
    // Now store is available to be populated
    createObjectStore(successCallBack, objectStores)
  };

  request.onerror = function (e) {
    console.error("链接失败..." , e);
    failedCallback();
  };
}

function createObjectStore(successCallBack, objectStores) {
    if (typeof objectStores === "string") {
      if (!db.objectStoreNames.contains(objectStores)) {
        // db.deleteObjectStore("ShoppingCart");
        let objectStore = db.createObjectStore(objectStores, {keyPath: "mobile"});
        console.log('创建表成功', objectStore)
      }else{
        console.log('表存在')
      }
    }
    if (objectStores instanceof Array) {
      for (let i = 0; i < objectStores.length; i++) {
        if (!db.objectStoreNames.contains(objectStores[i])) {
          // db.deleteObjectStore("ShoppingCart");
          db.createObjectStore(objectStores[i], {keyPath: "mobile"});
        }
      }
    }
    successCallBack();
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

function dbError(error) {
  console.error(error);
}
