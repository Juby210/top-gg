const { Plugin } = require('powercord/entities');
const { React, getModule, getAllModules } = require('powercord/webpack');
const { forceUpdateElement, getOwnerInstance, waitFor } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { TabBar } = require('powercord/components');

const DiscordBot = require('./components/DiscordBot');
const Fetcher = require('./handler');
module.exports = class BotInfo extends Plugin {
  async startPlugin () {
    this.classes = {
      ...await getModule([ 'headerInfo', 'nameTag' ]),
      ...await getAllModules([ 'modal', 'inner' ])[1],
      header: (await getModule([ 'iconBackgroundTierNone', 'container' ])).header
    };

    Object.keys(this.classes).forEach(
      key => this.classes[key] = `.${this.classes[key].split(' ')[0]}`
    );

    this.loadStylesheet('style.scss');
    this._patchUserProfile();
  }

  pluginWillUnload () {
    uninject('discord-bot-user-tab-bar');
    uninject('discord-bot-user-body');
    uninject('discord-bot-user-header');

    forceUpdateElement(this.classes.header);
  }

  async _patchUserProfile () {
    const { classes } = this;
    const instance = getOwnerInstance((await waitFor([
      classes.modal, classes.headerInfo, classes.nameTag
    ].join(' '))).parentElement);

    const { tabBarItem } = await getModule([ 'tabBarItem' ]);

    const UserProfileBody = instance._reactInternalFiber.return.type;
    const _this = this;

    inject('discord-bot-user-tab-bar', UserProfileBody.prototype, 'renderTabBar', function (_, res) {
      const { user } = this.props;

      // Don't bother rendering if there's no tab bar, user or if the user is a bot
      if (!res || !user || !user.bot) {
        return res;
      }

      // Create top.gg tab bar item
      const botTab = React.createElement(TabBar.Item, {
        key: 'DISCORD_BOT',
        className: tabBarItem,
        id: 'DISCORD_BOT'
      }, 'Bot');

      // Add the top.gg tab bar item to the list
      res.props.children.props.children.push(botTab);

      return res;
    });

    inject('discord-bot-user-body', UserProfileBody.prototype, 'render', function (_, res) {
      const { children } = res.props;
      const { section, user } = this.props;
      const fetchBot = (id) => Fetcher.fetchBot(id);
      const getSetting = (setting, defaultValue) => _this.settings.get(setting, defaultValue);

      if (section !== 'DISCORD_BOT') {
        return res;
      }

      const body = children.props.children[1];
      body.props.children = [];

      body.props.children.push(React.createElement(DiscordBot, { id: user.id,
        fetchBot,
        getSetting }));

      return res;
    });

    /*
     *TOOD: Will have to see how to implement this properly because fetching the bot is async but we can't inject async
     *inject('discord-bot-user-header', UserProfileBody.prototype, 'renderHeader', function (_, res) {
     *  const { user } = this.props;
     *  const bot = await _this.fetchBot(user.id);
     *
     *  return res;
     *});
     */
  }
};
