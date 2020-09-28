const { React } = require('powercord/webpack');

module.exports = class SVGBadge extends React.Component {
  render () {
    return (
      <img className="discord-bot-svg" src={`https://top.gg/api/widget/${this.props.id}.svg`}/>
    );
  }
};
