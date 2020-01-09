using Hasco.Bot.Core.Domain;
using Hasco.Bot.Core.Repositories;
using Hasco.Bot.Infrastructure.DTO;
using Hasco.Bot.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Threading.Tasks;
using TwitchLib.Client;
using TwitchLib.Client.Enums;
using TwitchLib.Client.Events;
using TwitchLib.Client.Extensions;
using TwitchLib.Client.Interfaces;
using TwitchLib.Client.Models;

namespace Hasco.Bot.Infrastructure.Twitch
{
    public class TwitchBot
    {
        private bool _isReady = false;
        private static readonly TwitchClient _twitchClient = new TwitchClient();
        private List<string> giveawayList = new List<string>();
        private bool _isGiveawayStarted = false;
        private List<string> blockedPhrases = new List<string>();


        public TwitchBot()
        {
            ConnectionCredentials credentials = new ConnectionCredentials("hascobot", "7hgoswpihof58suvjq033b5dzbzib3");

            //_twitchClient = new TwitchClient();
            _twitchClient.Initialize(credentials);
            _twitchClient.Connect();
            _twitchClient.OnConnected += TwitchClientConnected;
            _twitchClient.OnJoinedChannel += Client_OnJoinedChannel;
            _twitchClient.OnMessageReceived += Client_OnMessageReceived;
            blockedPhrases.Add("dupa");
    }

        private void TwitchClientConnected(object sender, OnConnectedArgs onConnectedArgs)
        {
            _isReady = true;
        }

        private void Client_OnMessageReceived(object sender, OnMessageReceivedArgs e)
        {
            if (e.ChatMessage.Message.Contains("Hi"))
            {
                _twitchClient.SendMessage(e.ChatMessage.Channel, e.ChatMessage.DisplayName);
            }

            if(_isGiveawayStarted == true)
            {
                if (e.ChatMessage.Message.Contains("!giveaway"))
                {
                    if (!giveawayList.Contains(e.ChatMessage.DisplayName))
                    {
                        giveawayList.Add(e.ChatMessage.DisplayName);
                        _twitchClient.SendMessage(e.ChatMessage.Channel, $"Welcome in a giveaway {e.ChatMessage.DisplayName}, good luck!");
                    }
                    else
                    {
                        _twitchClient.SendMessage(e.ChatMessage.Channel, "Heey you're in a giveaway, don't try to cheat!");
                    }
                }
            }


            foreach (string blockedPhrase in blockedPhrases) {
                if(e.ChatMessage.Message.Contains(blockedPhrase))
                {
                    _twitchClient.TimeoutUser(e.ChatMessage.Channel, e.ChatMessage.DisplayName, new TimeSpan(0, 0, 0, 30), $"Nie wolno tak pisac {e.ChatMessage.DisplayName}");
                }
                else
                {
                    continue;
                }
            }
        }


        private void Client_OnJoinedChannel(object sender, OnJoinedChannelArgs e)
        {
            _twitchClient.SendMessage(e.Channel, "Hey guys, I'm back :]");
        }

        public async Task ConnectToAnotherChannel(string channelName)
        {
            _twitchClient.JoinChannel(channelName);

            await Task.CompletedTask;
        }

        public async Task DisconnectFromChannel(string channelName)
        {
            await this.SendMessage(channelName, "I am leaving the channel :[");
            _twitchClient.LeaveChannel(channelName);

            await Task.CompletedTask;
        }

        public async Task SendMessage(string channelName, string message)
        {

            _twitchClient.SendMessage(channelName, message);

            await Task.CompletedTask;
        }

        public async Task TimeoutUser(string channelName, string userName, TimeSpan duration, string message)
        {
            var joinedChannel = _twitchClient.GetJoinedChannel(channelName);
            _twitchClient.TimeoutUser(joinedChannel,userName,duration,message);
            await Task.CompletedTask;
        }

        public async Task ClearChat(string channelName)
        {
            var joinedChannel = _twitchClient.GetJoinedChannel(channelName);
            _twitchClient.ClearChat(joinedChannel);

            await Task.CompletedTask;
        }

        public async Task FollowersOn(string channelName, string minutes)
        {
            int result = Int32.Parse(minutes);
            _twitchClient.FollowersOnlyOn(channelName, new TimeSpan(0, 0, result, 0));

            await Task.CompletedTask;
        }

        public async Task FollowersOff(string channelName)
        {
            _twitchClient.FollowersOnlyOff(channelName);

            await Task.CompletedTask;
        }

        public async Task SubscriberOn(string channelName)
        {
            _twitchClient.SubscribersOnlyOn(channelName);

            await Task.CompletedTask;
        }
        public async Task SubscriberOff(string channelName)
        {
            _twitchClient.SubscribersOnlyOff(channelName);

            await Task.CompletedTask;
        }

        public async Task EmoteOnlyOn(string channelName)
        {
            _twitchClient.EmoteOnlyOn(channelName);

            await Task.CompletedTask;
        }
        public async Task EmoteOnlyOff(string channelName)
        {
            _twitchClient.EmoteOnlyOff(channelName);

            await Task.CompletedTask;
        }

        public async Task SlowOn(string channelName, string seconds)
        {
            int result = Int32.Parse(seconds);
            _twitchClient.SlowModeOn(channelName, new TimeSpan(0, 0, 0, result));

            await Task.CompletedTask;

        }

        public async Task SlowOff(string channelName)
        {
            _twitchClient.SlowModeOff(channelName);

            await Task.CompletedTask;
        }

        public async Task StartGiveaway(string channelName)
        {
            _isGiveawayStarted = true;
            _twitchClient.SendMessage(channelName, $"Giveaway is starting...");

            await Task.CompletedTask;
        }

        public async Task DrawTheWinner(string channelName)
        {
            var random = new Random();
            int index = random.Next(giveawayList.Count);
            _twitchClient.SendMessage(channelName, $"The winner is {giveawayList[index]}");
            _isGiveawayStarted = false;

            await Task.CompletedTask;

        }

        public async Task AddPhrase(string channelName, string phrase)
        {
            blockedPhrases.Add(phrase);
            await Task.CompletedTask;
        }

        public async Task RemovePhrase(string channelName, string phrase)
        {
            blockedPhrases.Remove(phrase);
            await Task.CompletedTask;
        }




        // just only for tests
        public async Task<IReadOnlyList<JoinedChannel>> GetJoinedChannels()
        {
            var joinedChannels = _twitchClient.JoinedChannels;
            await Task.CompletedTask;

            return joinedChannels;
        }

        public TimeSpan AddSeconds(TimeSpan timeSpan, int secondsToAdd)
        {
            TimeSpan newSpan = new TimeSpan(0, 0, 0, secondsToAdd);
            return timeSpan.Add(newSpan);
        }
        public TimeSpan AddMinutes(TimeSpan timeSpan, int minutesToAdd)
        {
            TimeSpan newSpan = new TimeSpan(0, 0, 0, minutesToAdd);
            return timeSpan.Add(newSpan);
        }
    }
}