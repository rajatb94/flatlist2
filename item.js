import React from 'react';
import { Text, View} from 'react-native';
class ItemComponent extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    var self = this;
    var item=this.props.item;
    var index=this.props.index;
    return (
        <View ref={(view)=>{this.props.addToItems(index, view)}}>
            {item}
        </View>
    );
  }
}


module.exports=ItemComponent;
