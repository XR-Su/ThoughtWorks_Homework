/**
 * @Name:
 * @Description:
 * @author RiSusss
 * @date 2019/4/11
 */

import React, { Component } from "react";
import MenuItem from "./menuItem";

class Menu extends Component {
  state = {
    cur: 'agent'
  };
  onChangeCur = val => {
    console.log("onchange");
    console.log(val);
    this.setState(preState => ({ cur: val }));
  };
  renderChildren = () => {
    console.log(this.props.children);
    return React.Children.map(this.props.children, (child, index) => {
      const itemKey = child.key;
      return React.cloneElement(child, {
        cur: this.state.cur,
        onChangeCur: this.onChangeCur,
          itemKey: itemKey
      });
    });
  };
  render() {
    return <ul className="cruise-menu">{this.renderChildren()}</ul>;
  }
}

Menu.Item = MenuItem;

export default Menu;
