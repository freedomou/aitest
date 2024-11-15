let currentIndex = 0;
const images = document.querySelectorAll('.carousel-image');
const totalImages = images.length;

function showSlide(index) {
  if (index >= totalImages) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalImages - 1;
  } else {
    currentIndex = index;
  }

  const offset = -currentIndex * 100;
  document.querySelector('.carousel-slide').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

// 自动播放轮播图
setInterval(nextSlide, 3000);

// 初始化轮播图
showSlide(currentIndex);

// 聊天功能
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// 定义GLM-4的API调用函数
async function callGLM4API(userMessage) {
  const apiKey = 'your-secret-key';  // 请用你的实际API密钥替换
  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const body = JSON.stringify({
    model: 'glm-4-flash',  // 根据需要选择模型编码
    messages: [
      { role: 'user', content: userMessage }
    ],
    stream: false  // 一次性返回完整结果
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error('网络响应失败');
    }

    const data = await response.json();
    return data.choices[0].message.content;  // 获取GLM-4的回复内容
  } catch (error) {
    console.error('调用GLM-4 API出错:', error);
    return '无法获取回复，请稍后再试。';
  }
}

function sendMessage() {
  const messageText = chatInput.value.trim();
  if (messageText === '') return;

  // 显示用户的消息
  const userMessage = createMessage(messageText, 'user-message');
  chatMessages.appendChild(userMessage);

  // 清空输入框
  chatInput.value = '';

  // 调用GLM-4的API并获取回复
  callGLM4API(messageText).then(botReply => {
    const botMessage = createMessage(botReply, 'bot-message');
    chatMessages.appendChild(botMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

function createMessage(text, className) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${className}`;
  messageDiv.textContent = text;
  return messageDiv;
}