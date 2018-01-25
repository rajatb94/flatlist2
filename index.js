import React from 'react';
var Q = require("q");
import { View, FlatList, findNodeHandle} from 'react-native';
var ItemComponent = require("./item");
class FlatList2 extends React.Component {
  constructor(props){
    super(props);
    this.itemsRef=[];
    this.isItemsPosDone=false;
    this.curItem=0;
    this.prvDirection=null;
    this.prvOffset=0;
  }
  addToItems(index, itemRef){
    var self=this;
    self.itemsRef[index]={itemRef};
  }
  getItemPos(item){
    var deferred = Q.defer();
    item.measureLayout(findNodeHandle(this.view),function(ox, oy, width, height, px, py) {
        deferred.resolve(oy);
    }, function(err){
        if(err){
            deferred.reject(err);
        }
    })
    return deferred.promise;
  }
  onScroll(e){
    var self=this;
    if(this.props.onScroll)
        this.props.onScroll(e);
    var scrollOffset = (self.props.horizontal)?e.nativeEvent.contentOffset.x:e.nativeEvent.contentOffset.y;
    setTimeout(function(){
        if(self.props.onScrollDirectionChanged){
            var fDir=(self.props.horizontal)?"left":"up";
            var sDir=(self.props.horizontal)?"right":"down";
            if(scrollOffset>self.prvOffset){
                if(self.prvDirection!=sDir){
                    self.prvDirection=sDir;
                    self.props.onScrollDirectionChanged(sDir);
                }
            }else if(scrollOffset<self.prvOffset){
                if(self.prvDirection!=fDir){
                    self.prvDirection=fDir;
                    self.props.onScrollDirectionChanged(fDir);
                }
            }
            self.prvOffset=scrollOffset;
        }
    },0);
    
    
    if(!self.isItemsPosDone){
        self.getItemsPos()
        .then(function(){
            var curItem=self.getCurrentItem(scrollOffset)
            self.props.onCurrentItemChanged(curItem);
        })
    }else{
        var curItem=self.getCurrentItem(scrollOffset);
        self.props.onCurrentItemChanged(curItem);
    }

    
  }
  getCurrentItem(scrollOffset){
    var self=this;
    var itemsLen=self.itemsRef.length;
    if(self.props.horizontal){
        var endOffset=self.props.rightOffset||0;
    }else{
        var endOffset=self.props.bottomOffset||0;
    }
    for(var i in self.itemsRef){
        var itemPos=self.itemsRef[itemsLen-i-1].pos;
        
        var viewMeasure=(self.props.horizontal)?self.viewWidth:self.viewHeight;
        if(scrollOffset>=(itemPos-viewMeasure+endOffset)){
            self.curItem=itemsLen-i-1;
            
            return self.curItem;
        }
    }
    return self.curItem;
  }
  getItemsPos(){
    var self=this;
    return Q.all(self.itemsRef.map(function(data, index){
        return  self.getItemPos(data.itemRef)
        .then(function(pos, index){
            data.pos=pos;
        })    
    }))
    .then(function(){
        self.isitemsPosDone=true;
    })
  }
  componentDidMount(){
      var self=this;
  }
  renderItem({item, index}){
      var self=this;
    var oldItem=this.props.renderItem({item, index});
    return <ItemComponent key={index} index={index} addToItems={self.addToItems.bind(self)} item={oldItem}/>
  }
  render() {
    var self = this;
    var superContainerStyle=this.props.containerStyle||{};
    var {onScroll, renderItem, data, ...others}=this.props;
    return (
        <View ref={(view)=>{this.view=view}} onLayout={(e)=>{this.viewHeight=e.nativeEvent.layout.height; this.viewWidth=e.nativeEvent.layout.width}}  style={[{width: "100%", height: "100%"}, superContainerStyle]}>
            
            <FlatList
                {...others}
                data={data}
                renderItem={this.renderItem.bind(this)}
                onScroll={this.onScroll.bind(this)}
            />
            
        </View>
    );
  }
}


module.exports=FlatList2;
