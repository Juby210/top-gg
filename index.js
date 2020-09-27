const { Plugin } = require('powercord/entities');
const { React, getModule, getAllModules } = require('powercord/webpack');
const { forceUpdateElement, getOwnerInstance, waitFor } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { get } = require('powercord/http');
const { TabBar } = require('powercord/components');

const DiscordBot = require('./components/DiscordBot');
const Settings = require('./components/Settings');

module.exports = class BotInfo extends Plugin {
  async startPlugin() {

    this.classes = {
      ...await getModule(['headerInfo', 'nameTag']),
      ...await getAllModules(['modal', 'inner'])[1],
      header: (await getModule(['iconBackgroundTierNone', 'container'])).header
    };

    Object.keys(this.classes).forEach(
      key => this.classes[key] = `.${this.classes[key].split(' ')[0]}`
    );

    powercord.api.settings.registerSettings('discord-bot', {
      category: 'discord-bot',
      label: 'discord.bot',
      render: Settings
    });

    this.loadStylesheet('style.css');
    this._patchUserProfile();

    powercord.api.connections.registerConnection({
      type: 'discord-bot',
      name: 'discord.bot',
      color: '#7289da',
      icon: {
        color: 'https://discord.com/assets/28174a34e77bb5e5310ced9f95cb480b.png',
        white: 'https://discord.com/assets/e05ead6e6ebc08df9291738d0aa6986d.png'
      },
      enabled: true,
      fetchAccount: async (id) => {
        try {
          if (!id) {
            ({
              id
            } = (await getModule(['getCurrentUser'])).getCurrentUser());
          }

          const bot = await this.fetchBot(id);

          return ({
            type: 'discord-bot',
            id: bot.user.details.slug,
            name: bot.discord.username,
            verified: !!bot.user.details.verified
          });
        } catch (e) {
          //Just ignore the error, probably just 404
        }
      },
      getPlatformUserUrl: (account) => {
        const slug = account.id;
        return `https://dsc.bot/${encodeURIComponent(slug)}`;
      },
      onDisconnect: () => void 0
    });
  }

  pluginWillUnload() {
    uninject('discord-bot-user-tab-bar');
    uninject('discord-bot-user-body');
    uninject('discord-bot-user-header');

    powercord.api.connections.unregisterConnection('discord-bot');
    powercord.api.settings.unregisterSettings('discord-bot');

    forceUpdateElement(this.classes.header);
  }

  async fetchBot(id) {
    return await get(`https://api.discord.bot/user/details/${id}`)
      .then(r => r.body && r.body.payload);
  }

  async _patchUserProfile() {
    const { classes } = this;
    const instance = getOwnerInstance((await waitFor([
      classes.modal, classes.headerInfo, classes.nameTag
    ].join(' '))).parentElement);

    const { tabBarItem } = await getModule(['tabBarItem']);

    const UserProfileBody = instance._reactInternalFiber.return.type;
    const _this = this;

    inject('discord-bot-user-tab-bar', UserProfileBody.prototype, 'renderTabBar', function (_, res) {
      const { user } = this.props;

      //Don't bother rendering if there's no tab bar, user or if the user is a bot
      if (!res || !user || user.bot) return res;

      //Create discord.bot tab bar item
      const botTab = React.createElement(TabBar.Item, {
        key: 'DISCORD_BIO',
        className: tabBarItem,
        id: 'DISCORD_BIO'
      }, 'Bot');

      //Add the discord.bot tab bar item to the list
      res.props.children.props.children.push(botTab)

      return res;
    });

    inject('discord-bot-user-body', UserProfileBody.prototype, 'render', function (_, res) {
      const { children } = res.props;
      const { section, user } = this.props;
      const fetchBot = (id) => _this.fetchBot(id);
      const getSetting = (setting, defaultValue) => _this.settings.get(setting, defaultValue);

      if (section !== 'DISCORD_BIO') return res;

      const body = children.props.children[1];
      body.props.children = [];

      body.props.children.push(React.createElement(DiscordBot, { id: user.id, fetchBot, getSetting }));

      return res;
    });

    /*
    TOOD: Will have to see how to implement this properly because fetching the bot is async but we can't inject async
    inject('discord-bot-user-header', UserProfileBody.prototype, 'renderHeader', function (_, res) {
      const { user } = this.props;
      const bot = await _this.fetchBot(user.id);

      return res;
    });
    */
  }
}
