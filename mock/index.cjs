/**
 * @param {import('express').Router} router
 * @param {import('@faker-js/faker').Faker} faker
 */
module.exports = function (router, faker) {
  router.post('/api/auth/login', (req, res) => {
    res.send({
      code: '0000',
      msg: 'ok',
      data: {
        accessToken: faker.string.uuid(),
      },
    });
  });

  router.post('/api/auth/register', (req, res) => {
    res.send({
      code: '0000',
      msg: 'ok',
      data: {
        accessToken: faker.string.uuid(),
      },
    });
  });

  router.post('/api/user/logout', (req, res) => {
    res.send({
      code: '0000',
      msg: 'ok',
      data: null,
    });
  });

  router.post('/api/user/profile', (req, res) => {
    res.send({
      code: '0000',
      msg: 'ok',
      data: {
        uid: faker.string.numeric(10),
        username: '张三',
      },
    });
  });

  // --- 社区案例 mock ---
  const mockPosts = [
    {
      id: 1,
      userId: 1,
      nickname: '张律师',
      avatar: null,
      gender: 1,
      title: '一起劳动争议案件的胜诉分享',
      content: '近日代理了一起劳动争议案件，劳动者因公司未签订劳动合同要求双倍工资赔偿，最终仲裁委支持了我方全部诉求。\n\n这个案例的关键在于证据链的完整性...',
      images: [],
      likeCount: 128,
      commentCount: 32,
      createdAt: '2026-04-25T00:00:00.000Z',
    },
    {
      id: 2,
      userId: 2,
      nickname: '李律师',
      avatar: null,
      gender: 0,
      title: '合同纠纷调解成功案例',
      content: '通过诉前调解方式，成功帮助当事人追回货款50万元。调解相比诉讼，时间更短、成本更低，是解决商业纠纷的优选方案...',
      images: [],
      likeCount: 96,
      commentCount: 18,
      createdAt: '2026-04-24T00:00:00.000Z',
    },
    {
      id: 3,
      userId: 3,
      nickname: '王律师',
      avatar: null,
      gender: 1,
      title: '知识产权侵权案办案心得',
      content: '最近处理的一个商标侵权案件非常有代表性，涉及跨境电商平台的商标权保护问题，分享一些实务经验供同行参考...',
      images: [],
      likeCount: 205,
      commentCount: 47,
      createdAt: '2026-04-23T00:00:00.000Z',
    },
  ];

  // 社区案例列表
  router.get('/api/community/posts', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);
    const start = (page - 1) * pageSize;
    const items = mockPosts.slice(start, start + pageSize);
    res.send({
      code: '0000',
      msg: 'ok',
      data: {
        items,
        total: mockPosts.length,
        page,
        pageSize,
        hasMore: start + items.length < mockPosts.length,
      },
    });
  });

  // 社区案例详情
  router.get('/api/community/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const post = mockPosts.find((p) => p.id === id);
    if (!post) {
      res.status(404).send({
        code: '9999',
        msg: 'Post not found',
        data: null,
      });
      return;
    }
    res.send({
      code: '0000',
      msg: 'ok',
      data: post,
    });
  });

  // 发布案例
  router.post('/api/community/posts', (req, res) => {
    const { title, content } = req.body || {};
    const newPost = {
      id: faker.number.int({ min: 100, max: 9999 }),
      userId: 1,
      nickname: '当前用户',
      avatar: null,
      gender: null,
      title: title || '',
      content: content || '',
      images: [],
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    };
    res.send({
      code: '0000',
      msg: 'ok',
      data: newPost,
    });
  });

  // 点赞案例
  router.post('/api/community/posts/:id/like', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const post = mockPosts.find((p) => p.id === id);
    if (!post) {
      res.status(404).send({
        code: '9999',
        msg: 'Post not found',
        data: null,
      });
      return;
    }
    post.likeCount += 1;
    res.send({
      code: '0000',
      msg: 'ok',
      data: {
        liked: true,
        likeCount: post.likeCount,
      },
    });
  });

  // --- 评论 mock ---
  const mockComments = [
    {
      id: 1,
      postId: 1,
      userId: 101,
      nickname: '赵律师',
      avatar: null,
      gender: 0,
      content: '很实用的案例分享，感谢！劳动仲裁中的证据链确实关键。',
      createdAt: '2026-04-26T10:30:00.000Z',
    },
    {
      id: 2,
      postId: 1,
      userId: 102,
      nickname: '孙律师',
      avatar: null,
      gender: 1,
      content: '请问双倍工资的计算基数是税前还是税后？',
      createdAt: '2026-04-26T11:00:00.000Z',
    },
    {
      id: 3,
      postId: 1,
      userId: 1,
      nickname: '张律师',
      avatar: null,
      gender: 1,
      content: '回复孙律师：仲裁实践中以税前应发工资为基数。',
      createdAt: '2026-04-26T12:15:00.000Z',
    },
  ];

  // 获取评论列表
  router.get('/api/community/posts/:postId/comments', (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);
    const postComments = mockComments.filter((c) => c.postId === postId);
    const start = (page - 1) * pageSize;
    const items = postComments.slice(start, start + pageSize);
    res.send({
      code: '0000',
      msg: 'ok',
      data: {
        items,
        total: postComments.length,
        page,
        pageSize,
        hasMore: start + items.length < postComments.length,
      },
    });
  });

  // 发表评论
  router.post('/api/community/posts/:postId/comments', (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const { content } = req.body || {};
    const newComment = {
      id: faker.number.int({ min: 1000, max: 9999 }),
      postId,
      userId: 1,
      nickname: '当前用户',
      avatar: null,
      gender: null,
      content: content || '',
      createdAt: new Date().toISOString(),
    };
    mockComments.push(newComment);
    // 同步更新帖子评论数
    const post = mockPosts.find((p) => p.id === postId);
    if (post) post.commentCount += 1;
    res.send({
      code: '0000',
      msg: 'ok',
      data: newComment,
    });
  });
};
