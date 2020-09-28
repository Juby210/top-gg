// updated from https://medium.com/@ryanseddon/rendering-to-iframes-in-react-d1cb92274f86
const { React, ReactDOM } = require('powercord/webpack');
class Frame extends React.Component {
  render () {
    return <iframe style={{ height:'100%',
      width:'100%',
      display: 'block',
      border: 'none',
      margin: 0,
      padding: 0 }} />;
  }

  componentDidMount () {
    this.renderFrameContents();
  }

  renderFrameContents () {
    const doc = ReactDOM.findDOMNode(this).contentDocument;
    console.log(doc);
    if (doc.readyState === 'complete') {
      ReactDOM.render(this.props.children, doc.body);
      Array.prototype.forEach.call(document.querySelectorAll('link[rel=stylesheet]'), (link) => {
        const newLink = document.createElement('link');
        newLink.rel = link.rel;
        newLink.href = link.href;
        doc.head.appendChild(newLink);
      });
      Array.prototype.forEach.call(document.querySelectorAll('style'), (link) => {
        const newLink = document.createElement('style');
        newLink.innerHTML = link.innerHTML;
        doc.head.appendChild(newLink);
      });
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  }

  componentDidUpdate () {
    this.renderFrameContents();
  }

  componentWillUnmount () {
    // React.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
  }
}
module.exports = Frame;
