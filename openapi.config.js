export default [
  {
    src: 'mock/openapi.yaml',
    output: 'src/schemas/mock.ts',
    trimStart: ['/api'],
  },
  {
    src: 'http://microloan-microcredit-test-k.jhjj.spider.test/v2/api-docs?group=1.0%E7%89%88%E6%9C%AC',
    output: 'src/schemas/microcredit.ts',
    trimStart: ['/api/v1'],
  },
];
