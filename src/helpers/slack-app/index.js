const {WebClient, LogLevel} = require('@slack/web-api');
const teacherService = require('../../api/teachers/service');
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG,
});

const getChannelId = async (email) => {
  try {
    const response = await client.users.lookupByEmail({email});
    return response.user.id;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendMessageSlack: async (input, content) => {
    try {
      const teacher = await teacherService.find({_id: input.teacher});
      const id = await getChannelId(teacher.email);
      const result = await client.chat.postMessage({
        channel: id,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Xin chào *${teacher.name}* :wave:`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${content}*`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Đi tới lịch học',
                  emoji: true,
                },
                value: 'click_me_123',
                url: 'https://teacher.brightchamps.click/schedule',
              },
            ],
          },
        ],
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
