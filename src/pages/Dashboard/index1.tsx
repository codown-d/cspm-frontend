import { useState } from 'react';

const ColdJokesApp = () => {
  // Step 1: Define the jokes collection
  const jokes = [
    '为什么鱼不会说话？因为它们总是在水里。',
    '听说你想吃书，为什么？因为你觉得它很有味道。',
    '程序员的咖啡为什么这么苦？因为没有else。',
    '为什么电脑会生气？因为它遇到了一个无法解决的错误。',
    '程序员最讨厌去哪里？Bug岛。',
    '一只小熊去银行，结果什么都没取到。为什么？因为它没有熊掌！',
    '乌龟为什么不用手机？因为它随时都可以带壳上网。',
    '为什么鸡不能和别人分享？因为它们总是抓紧自己的蛋。',
    '程序员为什么不吃面条？因为它们讨厌BUG。',
    '为什么蜜蜂从不减肥？因为它们有蜂蜜。',
    '骆驼为什么不会沉？因为它有驼背。',
    '为什么橙子不能参加比赛？因为它被挤出了比赛。',
    '螃蟹为什么横着走？因为它怕被剪到脚。',
    '为什么青蛙喜欢跳水？因为它们总是湿的。',
    '你知道为什么程序员喜欢戴帽子吗？因为他们不想面对BUG。',
    '大象为什么带墨镜？因为它不想被认出来。',
    '为什么猴子喜欢爬树？因为它们喜欢高处的风景。',
    '什么书最悲伤？答案是账本，因为它记载了太多的亏损。',
    '你知道为什么自行车不能自己站立吗？因为它太累了。',
    '螃蟹和鲸鱼比赛游泳，结果螃蟹赢了，为什么？因为螃蟹走捷径了。',
    '袋鼠为什么不喜欢冬天？因为它们不能穿毛衣。',
    '什么动物最容易受骗？斑马，因为它有太多条纹了。',
    '小熊猫为什么爱吃竹子？因为竹子是它的“熊猫快餐”。',
    '长颈鹿为什么不坐公交车？因为它总是把头伸得太高。',
    '为什么海豚喜欢玩水？因为它们是水里的开心果。',
    '为什么程序员害怕夜晚？因为他们害怕暗BUG。',
    '企鹅为什么总是穿西装？因为它们要去南极的正式晚宴。',
    '为什么鸟儿喜欢飞行？因为地面太拥挤了。',
    '你知道恐龙为什么灭绝了吗？因为它们没有编程能力。',
    '为什么羊喜欢吃草？因为它们草率了。',
    '什么动物最爱笑？答案是海豚，因为它们总是在“开怀大笑”。',
    '鸭子为什么不能当医生？因为它总是嘎嘎叫。',
    '骆驼为什么喜欢沙漠？因为它们不想淋湿脚。',
    '程序员的眼镜为什么很厚？因为他们总是在debug。',
    '兔子为什么喜欢胡萝卜？因为它们认为胡萝卜有“兔”特质。',
    '为什么松鼠总是储存坚果？因为它们是自然界的“储蓄狂”。',
    '为什么乌龟从不急着赶路？因为它相信“慢慢走，总能到”。',
    '为什么程序员喜欢用黑屏？因为白屏太刺眼了。',
    '蛇为什么从不打字？因为它们没有手指。',
    '猫头鹰为什么晚上活动？因为它们有“夜班”合同。',
    '为什么鲸鱼唱歌？因为它们想成为海洋的“音乐明星”。',
    '鳄鱼为什么总是张着嘴？因为它们总是在等着吃东西。',
    '程序员为什么喜欢咖啡？因为它们需要“咖啡因”加速。',
    '为什么熊冬天会冬眠？因为它们不喜欢冷天。',
    '蜘蛛为什么喜欢在角落织网？因为它们想成为“网络管理员”。',
    '为什么袋鼠不坐电梯？因为它们喜欢跳。',
    '程序员的早餐为什么很简单？因为他们只吃“代码片”。',
    '为什么程序员总是坐在电脑前？因为它们是“键盘侠”。',
    '为什么企鹅从不怕冷？因为它们天生就穿着“毛衣”。',
  ];

  // Step 2: State to hold the current joke
  const [currentJoke, setCurrentJoke] = useState(() => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    return jokes[randomIndex];
  });

  // Step 3: Function to get a random joke
  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setCurrentJoke(jokes[randomIndex]);
  };

  return (
    <div style={styles.container}>
      {/* Step 4: Display the current joke and change it on click */}
      <p onClick={getRandomJoke} style={styles.jokeText}>
        {currentJoke}
      </p>
      <p style={styles.attribution}>拆除重建中......先来点别的吧！</p>
    </div>
  );
};

// Simple styling
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  jokeText: {
    fontSize: '24px',
    color: '#333',
    cursor: 'pointer',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
  },
  attribution: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#b2b2b2',
  },
};

export default ColdJokesApp;
