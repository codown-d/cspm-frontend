import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import TagSelect from '@/components/TagSelect';
import dayjs from 'dayjs';
import { useState } from 'react';

function Demo() {
  const [val, setVal] = useState();
  const filterData = [
    {
      label: '实例 ID',
      name: 'instance_id',
      type: 'input',
      icon: 'icon-bianhao',
      props: { placeholder: '请输入实例ID或名称' },
    },
    {
      label: '名称',
      name: 'instance_name',
      type: 'input',
      icon: 'icon-xingzhuangjiehe',
    },
    {
      label: '所属云账户',
      name: 'credential_ids',
      type: 'select',
      icon: 'icon-yonghujiaose',
      props: {
        mode: 'multiple',
        options: [
          {
            label: 'huawei',
            value: 1,
          },
          {
            label: 'tencent',
            value: 2,
          },
          {
            label: '遥遥领先',
            value: 3,
          },
          {
            label: '企鹅',
            value: 4,
          },
        ],
      },
    },
    {
      label: '资产类型',
      name: 'asset_type_ids',
      type: 'cascader',
      icon: 'icon-zhujimingcheng',
      props: {
        multiple: true,
        options: [
          {
            id: 'Huawei',
            label: '华为云',
            icon_name: '',
            num: 0,
            children: [
              {
                id: '830b7aa959cd4f46a4805e18ccccbeda',
                label: '云容器镜像服务 SWR',
                icon_name: '',
                num: 0,
                top_service: '830b7aa959cd4f46a4805e18ccccbeda',
                value: '830b7aa959cd4f46a4805e18ccccbeda',
              },
              {
                id: '25aa1d3a5c0272cf9bca5e8aa4527724',
                label: '云数据库 RDS',
                icon_name: '',
                num: 0,
                top_service: '25aa1d3a5c0272cf9bca5e8aa4527724',
                value: '25aa1d3a5c0272cf9bca5e8aa4527724',
              },
              {
                id: '6e518d61dfd683d186ace526f8e8e695',
                label: '云硬盘',
                icon_name: '',
                num: 0,
                top_service: '6e518d61dfd683d186ace526f8e8e695',
                value: '6e518d61dfd683d186ace526f8e8e695',
              },
              {
                id: 'b09bb934a0550c1a72cef6cad593d35b',
                label: '云证书管理 CCM',
                icon_name: '',
                num: 0,
                top_service: 'b09bb934a0550c1a72cef6cad593d35b',
                value: 'b09bb934a0550c1a72cef6cad593d35b',
              },
              {
                id: 'e40b303255d01773581fce75ff3d04ec',
                label: '内容分发网络 CDN',
                icon_name: '',
                num: 0,
                top_service: 'e40b303255d01773581fce75ff3d04ec',
                value: 'e40b303255d01773581fce75ff3d04ec',
              },
              {
                id: '3ec9cc00e89dfa4ddb262da897af4bfd',
                label: '对象存储服务 OBS',
                icon_name: '',
                num: 0,
                top_service: '3ec9cc00e89dfa4ddb262da897af4bfd',
                value: '3ec9cc00e89dfa4ddb262da897af4bfd',
              },
              {
                id: 'af11c410462470acfe1d754cf924bb17',
                label: '弹性云服务器 ECS',
                icon_name: '',
                num: 0,
                top_service: 'af11c410462470acfe1d754cf924bb17',
                value: 'af11c410462470acfe1d754cf924bb17',
              },
              {
                id: '131601bcbbae6ff1b749345c0534d1d3',
                label: '弹性负载均衡 ELB',
                icon_name: '',
                num: 0,
                top_service: '131601bcbbae6ff1b749345c0534d1d3',
                value: '131601bcbbae6ff1b749345c0534d1d3',
              },
              {
                id: 'e2fac0f7e08a9a2c47740175d3985303',
                label: '统一身份认证服务 IAM',
                icon_name: '',
                num: 0,
                top_service: 'e2fac0f7e08a9a2c47740175d3985303',
                value: 'e2fac0f7e08a9a2c47740175d3985303',
              },
              {
                id: '137b4836676fc188abfe82939cf1d9bb',
                label: '虚拟私有云 VPC',
                icon_name: '',
                num: 0,
                top_service: '137b4836676fc188abfe82939cf1d9bb',
                value: '137b4836676fc188abfe82939cf1d9bb',
              },
            ],
            top_service: '',
            value: 'Huawei',
          },
          {
            id: 'Tencent',
            label: '腾讯云',
            icon_name: '',
            num: 0,
            children: [
              {
                id: '19368c2eb6c0b6c2e2a506cdc987b67b',
                label: 'ACL',
                icon_name: '',
                num: 0,
                top_service: '47ff7fd10f8323cd366762c615dcf1b3',
                value: '19368c2eb6c0b6c2e2a506cdc987b67b',
              },
              {
                id: '65cdede8544cf133c2d021e259dc0f0b',
                label: 'API 网关',
                icon_name: '',
                num: 0,
                top_service: '65cdede8544cf133c2d021e259dc0f0b',
                value: '65cdede8544cf133c2d021e259dc0f0b',
              },
              {
                id: '13d14c1b0e69a1d9ad6f7060d6c99e36',
                label: 'SSL 证书',
                icon_name: '',
                num: 0,
                top_service: '13d14c1b0e69a1d9ad6f7060d6c99e36',
                value: '13d14c1b0e69a1d9ad6f7060d6c99e36',
              },
              {
                id: '70811808d48513c355b360c2635485a9',
                label: '云函数',
                icon_name: '',
                num: 0,
                top_service: '70811808d48513c355b360c2635485a9',
                value: '70811808d48513c355b360c2635485a9',
              },
              {
                id: 'f93dab3f2cbb9d227cc4c44778f9e2ba',
                label: '云服务器 CVM',
                icon_name: '',
                num: 0,
                top_service: 'f93dab3f2cbb9d227cc4c44778f9e2ba',
                value: 'f93dab3f2cbb9d227cc4c44778f9e2ba',
              },
              {
                id: '2022ad71cbaf10a51e780f3711b01611',
                label: '云硬盘',
                icon_name: '',
                num: 0,
                top_service: '2022ad71cbaf10a51e780f3711b01611',
                value: '2022ad71cbaf10a51e780f3711b01611',
              },
              {
                id: 'db109018bda29b6d72aaeaa32c03414f',
                label: '内容分发网络 CDN',
                icon_name: '',
                num: 0,
                top_service: 'db109018bda29b6d72aaeaa32c03414f',
                value: 'db109018bda29b6d72aaeaa32c03414f',
              },
              {
                id: 'ad4c94553842374910c88cb877a3b2f5',
                label: '域名注册',
                icon_name: '',
                num: 0,
                top_service: 'ad4c94553842374910c88cb877a3b2f5',
                value: 'ad4c94553842374910c88cb877a3b2f5',
              },
              {
                id: '809506d343cd73efa18b2453523e5d41',
                label: '安全组',
                icon_name: '',
                num: 0,
                top_service: '47ff7fd10f8323cd366762c615dcf1b3',
                value: '809506d343cd73efa18b2453523e5d41',
              },
              {
                id: '3cc2a5a415d81f88ab7f258e14ba9573',
                label: '对象存储 COS',
                icon_name: '',
                num: 0,
                top_service: '3cc2a5a415d81f88ab7f258e14ba9573',
                value: '3cc2a5a415d81f88ab7f258e14ba9573',
              },
              {
                id: 'a9587105035cb3c191b0c9e1198e1652',
                label: '弹性公网 IP',
                icon_name: '',
                num: 0,
                top_service: 'a9587105035cb3c191b0c9e1198e1652',
                value: 'a9587105035cb3c191b0c9e1198e1652',
              },
              {
                id: '49414fba903bb382ee741f15ebe602f9',
                label: '文件存储',
                icon_name: '',
                num: 0,
                top_service: '49414fba903bb382ee741f15ebe602f9',
                value: '49414fba903bb382ee741f15ebe602f9',
              },
              {
                id: '47ff7fd10f8323cd366762c615dcf1b3',
                label: '私有网络 VPC',
                icon_name: '',
                num: 0,
                top_service: '47ff7fd10f8323cd366762c615dcf1b3',
                value: '47ff7fd10f8323cd366762c615dcf1b3',
              },
              {
                id: '8c934c1ca6d1c14db6597aa00bf84030',
                label: '访问管理 CAM',
                icon_name: '',
                num: 0,
                top_service: '8c934c1ca6d1c14db6597aa00bf84030',
                value: '8c934c1ca6d1c14db6597aa00bf84030',
              },
              {
                id: 'edb49afdb94950ca3ed2b9e88e3a3f77',
                label: '访问管理 CAM(协作者)',
                icon_name: '',
                num: 0,
                top_service: '8c934c1ca6d1c14db6597aa00bf84030',
                value: 'edb49afdb94950ca3ed2b9e88e3a3f77',
              },
              {
                id: '575b4716f33fca37b936621af5aa9037',
                label: '访问管理 CAM(用户)',
                icon_name: '',
                num: 0,
                top_service: '8c934c1ca6d1c14db6597aa00bf84030',
                value: '575b4716f33fca37b936621af5aa9037',
              },
              {
                id: '9f25cf09961a5e121167e6001e4987f4',
                label: '访问管理 CAM(用户组)',
                icon_name: '',
                num: 0,
                top_service: '8c934c1ca6d1c14db6597aa00bf84030',
                value: '9f25cf09961a5e121167e6001e4987f4',
              },
              {
                id: '9645fdab7f9e3c0a0c17aa7e3189ed77',
                label: '负载均衡',
                icon_name: '',
                num: 0,
                top_service: '9645fdab7f9e3c0a0c17aa7e3189ed77',
                value: '9645fdab7f9e3c0a0c17aa7e3189ed77',
              },
            ],
            top_service: '',
            value: 'Tencent',
          },
        ],
      },
    },
    {
      label: '风险类型',
      name: 'risk_types',
      type: 'select',
      icon: 'icon-leixing',
      // value: ['vuln'],
      // fixed: true,
      props: {
        // mode: 'multiple',
        options: [
          {
            value: 'config',
            label: '配置风险',
          },
          {
            value: 'vuln',
            label: '漏洞',
          },
          {
            value: 'sensitive',
            label: '敏感文件',
          },
        ],
      },
    },
    {
      label: '区域',
      name: 'region_ids',
      type: 'cascader',
      icon: 'icon-weizhi',
      props: {
        multiple: true,
        options: [
          {
            key: 'Huawei',
            label: '华为云',
            icon_name: '',
            num: 0,
            children: [
              {
                key: '1583821eaca1746dfd0d33bb6cd85bfb',
                label: '华北-乌兰察布一',
                icon_name: 'ulanqab',
                num: 0,
                value: '1583821eaca1746dfd0d33bb6cd85bfb',
              },
              {
                key: '2577e18bfd6897d809d6610a4941bba5',
                label: '华北-北京一',
                icon_name: 'beijing',
                num: 0,
                value: '2577e18bfd6897d809d6610a4941bba5',
              },
              {
                key: '2c5317a25d8a1543a6ec638abcf54489',
                label: '亚太-新加坡',
                icon_name: 'singapore',
                num: 0,
                value: '2c5317a25d8a1543a6ec638abcf54489',
              },
              {
                key: '3447c298fc913b0e857065c415798a0b',
                label: '拉美-墨西哥城一',
                icon_name: 'mexico',
                num: 0,
                value: '3447c298fc913b0e857065c415798a0b',
              },
              {
                key: '4f220a4abfd033ea9f464f6c6bb80053',
                label: '拉美-圣保罗一',
                icon_name: 'stPaul',
                num: 0,
                value: '4f220a4abfd033ea9f464f6c6bb80053',
              },
              {
                key: '53f15f88ccc31fc25a7e5ab3a52e4d2e',
                label: '华东-上海一',
                icon_name: 'shanghai',
                num: 0,
                value: '53f15f88ccc31fc25a7e5ab3a52e4d2e',
              },
              {
                key: '57cf9ec9d6efe900a4143cf482b9fc18',
                label: '华东-上海二',
                icon_name: 'shanghai',
                num: 0,
                value: '57cf9ec9d6efe900a4143cf482b9fc18',
              },
              {
                key: '6d6f5642d84235e64aff0b10afe1f7fe',
                label: '华南-广州-友好用户环境',
                icon_name: 'guangzhou',
                num: 0,
                value: '6d6f5642d84235e64aff0b10afe1f7fe',
              },
              {
                key: '7e89e287a4fd436c7f420a3a6bace826',
                label: '西南-贵阳一',
                icon_name: 'guiyang',
                num: 0,
                value: '7e89e287a4fd436c7f420a3a6bace826',
              },
              {
                key: 'a259d76212a2c2e4491ac2c087e4e3f9',
                label: '中东-利雅得',
                icon_name: 'riyadh',
                num: 0,
                value: 'a259d76212a2c2e4491ac2c087e4e3f9',
              },
              {
                key: 'a31ad691f50c8b7f8e370b73de774a54',
                label: '亚太-雅加达',
                icon_name: 'jakarta',
                num: 0,
                value: 'a31ad691f50c8b7f8e370b73de774a54',
              },
              {
                key: 'a6ab50513fdf4c05c64cdb5d3233815f',
                label: '拉美-圣地亚哥',
                icon_name: 'santiago',
                num: 0,
                value: 'a6ab50513fdf4c05c64cdb5d3233815f',
              },
              {
                key: 'b50c1a9b744db65617d51d8ea43a2b33',
                label: '中东-阿布扎比-OP5',
                icon_name: 'abuDhabi',
                num: 0,
                value: 'b50c1a9b744db65617d51d8ea43a2b33',
              },
              {
                key: 'b602d586bc5fa8d40faa276ca9f9f91a',
                label: '非洲-约翰内斯堡',
                icon_name: 'johannesburg',
                num: 0,
                value: 'b602d586bc5fa8d40faa276ca9f9f91a',
              },
              {
                key: 'ba6f166df78eedf8b07436771eace9fe',
                label: '土耳其-伊斯坦布尔',
                icon_name: 'Istanbul',
                num: 0,
                value: 'ba6f166df78eedf8b07436771eace9fe',
              },
              {
                key: 'c3cf19618c982cbe7d9700faf77750dd',
                label: '亚太-曼谷',
                icon_name: 'bangkok',
                num: 0,
                value: 'c3cf19618c982cbe7d9700faf77750dd',
              },
              {
                key: 'cecb0146c1099a9fc0b06d90827bb4a5',
                label: '华北-北京四',
                icon_name: 'beijing',
                num: 0,
                value: 'cecb0146c1099a9fc0b06d90827bb4a5',
              },
              {
                key: 'dbd85ccdb22dd1f3a4c0ac6b2bf56bec',
                label: '华南-广州',
                icon_name: 'guangzhou',
                num: 0,
                value: 'dbd85ccdb22dd1f3a4c0ac6b2bf56bec',
              },
              {
                key: 'e78859bb425c4a4b2299d762ae652e3d',
                label: '欧洲-都柏林',
                icon_name: 'dublin',
                num: 0,
                value: 'e78859bb425c4a4b2299d762ae652e3d',
              },
              {
                key: 'e9f6e5e0a8e0c13599756975af3804b0',
                label: '拉美-墨西哥城二',
                icon_name: 'mexico',
                num: 0,
                value: 'e9f6e5e0a8e0c13599756975af3804b0',
              },
              {
                key: 'fe320cff987a4b23dbcfc441a784a254',
                label: '中国-香港',
                icon_name: 'hongkong',
                num: 0,
                value: 'fe320cff987a4b23dbcfc441a784a254',
              },
            ],
            value: 'Huawei',
          },
          {
            key: 'Tencent',
            label: '腾讯云',
            icon_name: '',
            num: 0,
            children: [
              {
                key: '0b5268636a0776ab9a061d9613f41757',
                label: '华南地区（深圳）',
                icon_name: 'shenzhen',
                num: 0,
                value: '0b5268636a0776ab9a061d9613f41757',
              },
              {
                key: '11ed70352854891255c56fc298ecd063',
                label: '港澳台地区（中国台北）',
                icon_name: 'taipei',
                num: 0,
                value: '11ed70352854891255c56fc298ecd063',
              },
              {
                key: '11f261d443b2d3073c0284b03211b884',
                label: '亚太东南（新加坡）',
                icon_name: 'singapore',
                num: 0,
                value: '11f261d443b2d3073c0284b03211b884',
              },
              {
                key: '1547198769a09b2fb1c32247c854914d',
                label: '港澳台地区（中国香港）',
                icon_name: 'hongkong',
                num: 0,
                value: '1547198769a09b2fb1c32247c854914d',
              },
              {
                key: '251488b60448b0d40980b1f0615b61ec',
                label: '亚太东北（东京）',
                icon_name: 'tokyo',
                num: 0,
                value: '251488b60448b0d40980b1f0615b61ec',
              },
              {
                key: '303461a0cdc1fa634ba32d4bc58d8e63',
                label: '欧洲地区（法兰克福）',
                icon_name: 'frankfurt',
                num: 0,
                value: '303461a0cdc1fa634ba32d4bc58d8e63',
              },
              {
                key: '3353e3038338db12acb786ae9623ba78',
                label: '美国西部（硅谷）',
                icon_name: 'siliconValley',
                num: 0,
                value: '3353e3038338db12acb786ae9623ba78',
              },
              {
                key: '40916086929c24d104478475780fccb4',
                label: '华北地区（北京）',
                icon_name: 'beijing',
                num: 0,
                value: '40916086929c24d104478475780fccb4',
              },
              {
                key: '4f912f54d13be808efcffb0b54b9c550',
                label: '美国东部（弗吉尼亚）',
                icon_name: 'virginia',
                num: 0,
                value: '4f912f54d13be808efcffb0b54b9c550',
              },
              {
                key: '511d3957c39a2080122e201648d652df',
                label: '亚太东南（曼谷）',
                icon_name: 'bangkok',
                num: 0,
                value: '511d3957c39a2080122e201648d652df',
              },
              {
                key: '795af2fb67c2453f7b78dfa98ef20ce6',
                label: '华东地区（上海）',
                icon_name: 'shanghai',
                num: 0,
                value: '795af2fb67c2453f7b78dfa98ef20ce6',
              },
              {
                key: '7d3ec5da74a0f4100e737a161f9108ba',
                label: '华东地区（南京）',
                icon_name: 'nanjing',
                num: 0,
                value: '7d3ec5da74a0f4100e737a161f9108ba',
              },
              {
                key: '862dad9e6d8015457b8ea38b8bbd3fa4',
                label: '亚太东南（雅加达）',
                icon_name: 'jakarta',
                num: 0,
                value: '862dad9e6d8015457b8ea38b8bbd3fa4',
              },
              {
                key: 'a9cd9975d533c8e5b0c75052123a4aa1',
                label: '西南地区（重庆）',
                icon_name: 'chongqing',
                num: 0,
                value: 'a9cd9975d533c8e5b0c75052123a4aa1',
              },
              {
                key: 'ad51c1db512e824a920151b74c404cff',
                label: '南美地区（圣保罗）',
                icon_name: 'stPaul',
                num: 0,
                value: 'ad51c1db512e824a920151b74c404cff',
              },
              {
                key: 'c27223c02352bf021c7c4441d9afb0f4',
                label: '西南地区（成都）',
                icon_name: 'chengdu',
                num: 0,
                value: 'c27223c02352bf021c7c4441d9afb0f4',
              },
              {
                key: 'ca41ccd596476925280e53d6ec35d52d',
                label: '北美地区（多伦多）',
                icon_name: 'toronto',
                num: 0,
                value: 'ca41ccd596476925280e53d6ec35d52d',
              },
              {
                key: 'dce437a21ef0b20c2808f469cf6c3c04',
                label: '亚太东北（首尔）',
                icon_name: 'seoul',
                num: 0,
                value: 'dce437a21ef0b20c2808f469cf6c3c04',
              },
              {
                key: 'e1f1cf03a7d832bb95fe13ba99683365',
                label: '华南地区（广州）',
                icon_name: 'guangzhou',
                num: 0,
                value: 'e1f1cf03a7d832bb95fe13ba99683365',
              },
              {
                key: 'e69d6dc9483ab2eaf849d7a587668161',
                label: '华北地区（天津）',
                icon_name: 'tianjin',
                num: 0,
                value: 'e69d6dc9483ab2eaf849d7a587668161',
              },
              {
                key: 'f98dcd4c9c143cdb6ca05201b3bc2075',
                label: '亚太南部（孟买）',
                icon_name: 'bombay',
                num: 0,
                value: 'f98dcd4c9c143cdb6ca05201b3bc2075',
              },
            ],
            value: 'Tencent',
          },
        ],
      },
    },
    {
      label: '更新时间',
      name: 'updated_at',
      type: 'rangePickerCt',
      icon: 'icon-shijian',
      fixed: true,
      value: [dayjs('2000-01-01'), dayjs('2000-02-01')],
      props: {
        showTime: true,
      },
    },
  ];

  const dataFilter = useTzFilter({ initial: filterData });

  return (
    <TzPageContainer
      header={{
        title: 'demo',
      }}
    >
      <TagSelect
        label="数据分级"
        value="2"
        options={[
          { label: '一级', value: '1' },
          { label: '二级', value: '2' },
          { label: '三级', value: '3' },
        ]}
        popupMatchSelectWidth={100}
        showSearch={false}
        clearable={false}
      />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px]">
          <TzFilter />
          <TzFilterForm onChange={setVal} />
        </div>
      </FilterContext.Provider>
      <br></br>
      {JSON.stringify(val)}
      {/* <ModelSteps /> */}
      {/* <Main />
      {showPlugin && (
        <PluginsDrawer
          name={'-'}
          onClose={() => setShowPlugin(false)}
          open={showPlugin}
        />
      )}
      <TzButton onClick={() => setShowPlugin(true)}>show drawer</TzButton> */}
    </TzPageContainer>
  );
}

export default Demo;
