/**
 * @Name: cruise popover
 * @Description: 这里原本是作为弹出框的基础组件，待改善
 * @author RiSusss
 * @date 2019-04-10
 */
import React, { PureComponent, Fragment } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import Button from "../Button";

export default class Popover extends PureComponent {
  state = {
    visible: false,
    popoverX: 0,
    popoverY: 0
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.hidePopover);
  }

  /**
   * click popover content
   * @desc prevent propagation to document
   * @param e
   */
  handleClickPopover = e => {
    e.nativeEvent.stopImmediatePropagation();
  };

  /**
   * get pop orientation info
   * @param e
   * @returns {{}|{}|*}
   */
  getPopOrientation = e => {
    let rect = e.getBoundingClientRect(),
      direct = document.body.clientHeight - rect.top > 160 ? "top" : "bottom",
      popoverX = rect.left + -14 + "px",
      popoverY =
        direct === "top"
          ? rect.top + rect.height + 16 + "px"
          : rect.top - rect.height - 130 + "px";
    return (this.orient = { ...{ direct, popoverX, popoverY } });
  };

  /**
   * show popover
   * @param e
   */
  showPopover = e => {
    const orient = this.getPopOrientation(e);
    this.setState(preState => ({
      visible: true,
      popoverX: orient.popoverX,
      popoverY: orient.popoverY
    }));
    document.addEventListener("click", this.hidePopover);
  };

  /**
   * hide popover
   */
  hidePopover = () => {
    const { onHide } = this.props;
    onHide();
    this.setState(preState => ({ visible: false }));
    document.removeEventListener("click", this.hidePopover);
  };

  /**
   * render child dom
   * @returns {*}
   */
  renderChild = () => {
    const child = this.props.children;
    const res = React.cloneElement(child, {
      onClick: () => this.showPopover(this.childNode),
      ref: node => {
        this.childNode = node;
      }
    });
    return res;
  };

  /**
   * render popover header
   * @returns {*}
   */
  renderPopoverHeader = () => (
    <div className="cruise-popover-header">
      <i className="icon-close" onClick={this.hidePopover} />
    </div>
  );

  /**
   * render popover footer
   * @returns {*}
   */
  renderPopoverFooter = () => {
    const {
      onOk,
      onCancel,
      okText,
      cancelText,
      footer,
      hideAfterOk,
      hideAfterCancel
    } = this.props;
    const okFn = () => {
      onOk();
      if (hideAfterOk) this.hidePopover();
    };
    const cancelFn = () => {
      onCancel();
      if (hideAfterCancel) this.hidePopover();
    };
    return Array.isArray(footer) ? (
      <div>{footer.map(item => item)}</div>
    ) : (
      <div>
        <Button type="primary" onClick={okFn}>
          {okText || "Ok"}
        </Button>
        <Button type="cancel" onClick={cancelFn}>
          {cancelText || "Cancel"}
        </Button>
      </div>
    );
  };

  /**
   * render popover
   * @returns {*}
   */
  renderPopover = () => {
    const { visible, popoverX, popoverY } = this.state,
      { content } = this.props,
      display = visible ? "block" : "none",
      arrow = (
        <span
          className={
            (this.orient && this.orient.direct) === "top"
              ? "cruise-popover-arrow__top"
              : "cruise-popover-arrow__bottom"
          }
        />
      );

    return (
      <div className="cruise-popover-wrapper">
        <div
          className="cruise-popover"
          onClick={this.handleClickPopover}
          style={{
            display: display,
            left: popoverX,
            top: popoverY
          }}
        >
          {arrow}
          {this.renderPopoverHeader()}
          {content || null}
          {this.renderPopoverFooter()}
        </div>
      </div>
    );
  };
  render() {
    return (
      <Fragment>
        {this.renderChild()}
        {createPortal(this.renderPopover(), document.getElementById("root"))}
      </Fragment>
    );
  }
}

Popover.defaultProps = {
  onOk: () => {},
  onCancel: () => {},
  onHide: () => {},
  hideAfterOk: false,
  hideAfterCancel: true
};

Popover.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onHide: PropTypes.func,
  hideAfterOk: PropTypes.bool,
  hideAfterCancel: PropTypes.bool
};
