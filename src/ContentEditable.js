import * as React from 'react';

// https://github.com/lovasoa/react-contenteditable/issues/161

function normalizeHtml(str) {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ');
}


  let focusOnCursorElement = () =>  {
      let cursor = document.getElementById("cursor");
      if(!cursor) return
      let range = document.createRange()
      let sel = window.getSelection()

      range.setStart(cursor, 0)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
      cursor.focus()
  }

function replaceCaret(el) {
  // Place the caret at the end of the element
  // const target = document.createTextNode('');
  // el.appendChild(target);


  const isTargetFocused = document.activeElement === el;

  if (isTargetFocused) {
    focusOnCursorElement()
  }
  // // do not move caret if element was not focused
  // const isTargetFocused = document.activeElement === el;
  // if (target !== null && target.nodeValue !== null && isTargetFocused) {
  //   var sel = window.getSelection();
  //   if (sel !== null) {
  //     var range = document.createRange();
  //     range.setStart(target, target.nodeValue.length);
  //     range.collapse(true);
  //     sel.removeAllRanges();
  //     sel.addRange(range);
  //   }
  //   if (el instanceof HTMLElement) el.focus();
  // }
}

/**
 * A simple component for an html element with editable contents.
 */
export default class ContentEditable extends React.Component<Props> {
  lastHtml = this.props.html;
  el = typeof this.props.innerRef === 'function' ? { current: null } : React.createRef();

  getEl = () => (this.props.innerRef && typeof this.props.innerRef !== 'function' ? this.props.innerRef : this.el).current;

  render() {
    const { tagName, html, innerRef, ...props } = this.props;

    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref: typeof innerRef === 'function' ? (current) => {
          innerRef(current)
          this.el.current = current
        } : innerRef || this.el,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyUp: this.props.onKeyUp || this.emitChange,
        onKeyDown: this.props.onKeyDown || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: { __html: html }
      },
      this.props.children);
  }

  shouldComponentUpdate(nextProps): boolean {
    const { props } = this;
    const el = this.getEl();

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (
      normalizeHtml(nextProps.html) !== normalizeHtml(el.innerHTML)
    ) {
      return true;
    }

    // Handle additional properties
    return props.disabled !== nextProps.disabled ||
      props.tagName !== nextProps.tagName ||
      props.className !== nextProps.className ||
      props.innerRef !== nextProps.innerRef ||
      JSON.stringify(props.style) !== JSON.stringify(nextProps.style)
  }

  componentDidUpdate() {
    const el = this.getEl();
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.props.html;
    }
    this.lastHtml = this.props.html;
    replaceCaret(el);
  }

  emitChange = (originalEvt) => {
    const el = this.getEl();
    if (!el) return;

    const html = el.innerHTML;
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html
        }
      });

    // if (this.props.onKeyDown) {
    //   this.props.onKeyDown(evt)
    // }
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  }
}
