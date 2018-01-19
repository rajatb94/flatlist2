# FlatList2
React Native FlatList with extended functionalities

## Installation
Enter it in to the terminal being in the project directory.

```npm install flatlist2 --save```

## Importing
```js
var FlatList2 = require("flatlist2")
```


## TrackItem
You can now track which item has just entered the visible area using ``` onCurrentItemChanged``` listiner 

### example:

```js
	var itemsAr=[];// array of items
	<FlatList2
        pagingEnabled
        data={itemsAr.map((itm, index)=>{itm.key=index;return itm;})}
        renderItem={({item, index}) => {return <MyItem key={index} data={item}/>}}
        onCurrentItemChanged={(curItemSeq)=>{console.log(curItemSeq)}}
    />
```

### Extra Props:

#### ```onCurrentItemChanged(callback(currentItemSeq))```
Takes a callback that receives current item sequence (position of the item in the list)

### ```superContainerStyle```
Receives style for the wrapper or container that contains original ```FlatList```. e.g. ```superContainerStyle={{padding: 8}} ```

### ```bottomOffset```
It tells at what offset from the bottom of the view should the next item be considered as visible. By default its value is 0 so the sequence will be changed as soon as the next item starts appearing on the view. e.g.  ```bottomOffset={100}```

