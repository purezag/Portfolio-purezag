'use strict';

const PHOTOS = {
  'air-1': {
    a: 'Ross Parmly',
    c: '#aab0b4',
    r: 0.664,
    q: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAwAgCdASoQAAsAA4BaJZgCdAEekUDduo3VAAD5KSxHRhMcLAhCXQnLwvDDjIYaap5fOBRX/cxAHlGK7JdndruR+fEBbS8F2X5lXIgA'
  },
  'air-2': {
    a: '@felirbe',
    c: '#45525b',
    r: 1.339,
    q: 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAQBACdASoQABUAPu1mqk4ppaOiMAgBMB2JYwCw7CHYO646uu+I2yH0AAD+8p4DSsolEZHXwoJTIvwQueClRLOViWSUh1/j/byqp/V9dE4t5ICPYe4fMgcA/rJUg+hoIo/vTtS+9Jy72hAELBkAAA=='
  },
  'air-3': {
    a: 'Leonardo Yip',
    c: '#2d2b29',
    r: 1.25,
    q: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JYwC/OCHfyeBw37RIscqpgAD+8ygGoLMAgjCLcTiLJVHeZ/S2Ib6DXHf/9iFkb67nz7rD0VJDep6mqK5cgAAA'
  },
  'eze-1': {
    a: 'Barbara Zandoval',
    c: '#677a75',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAABQAgCdASoQAAsAA4BaJbACdAYub2s24tlrgwAA/pb4514z6Sa1uFPdmosGbrVTPmzUJ82fjBIx9sZVdm0Qj/QS332J3dWhiST6NqgyX6YSrhAmRV2ildbsMR1Abrar9w5obUG/A+/SZkGHgQx3loMPqoAAAA=='
  },
  'eze-2': {
    a: 'Nestor Barbitta',
    c: '#6e797e',
    r: 1.334,
    q: 'data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAADwAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JYwC2yCID10XgyCH5u4HYAP6RH+R0SCuvcooIaE2tnfSc/DiOat4X41VUIaH/n9PmCi4w6zWP6MNjIejyCqucdbLQz/CLV1NsQ/EAd3FMqGcndba74COUqFuJ4BYWT3LL1HLofm57ITiW4mTMDtJaAAA='
  },
  'eze-3': {
    a: 'Rikin Katyal',
    c: '#3b6d8b',
    r: 1.333,
    q: 'data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JbACdMoR4OsAAQuYqMzJkgAD+cV/NalF8v1f8XDnrYJIrUPSdmVpTXM62m2EjdM7u7c66CCfJgWGaedsfPA3qDSwBMeuOLGGbYRbDgXcz3EU0QPynXHgTFJ1d+vN3Xid6vC+GpdGiiiWpSosIqlgLN8eus4Zm08WY9CKsP1BbWymI9XYoFgAA'
  },
  'fen-1': {
    a: 'Rodolfo Barretto',
    c: '#849c95',
    r: 1.778,
    q: 'data:image/webp;base64,UklGRrYAAABXRUJQVlA4IKoAAAAQBACdASoQABwALrV2u12jqampiYC0S2AE6ZQCcAJm8zvFFgTJtOJMIgD+VI6p3CS8kcRAFjkgmTxS+BzR3Px1HNckwvwE3deZWzkZwIwQk1o9zAK4hNWfuO0i4VIRWu8FlrCqAKfhCHf+TCppZ7VRsLIQUGASQXTL5nJYb3cjWwuZP/obhaaAGOaWc6mlZPiXVVIe5N6udUf2SQRAEhqeXZJU1KKMS76gAA=='
  },
  'fen-2': {
    a: 'Ze Paulo',
    c: '#719fa9',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAQCdASoQAAsAA4BaJbACdAEQTkKKAAD+4MbNlVbbrSX7sw3YupwcOZGyuBcFB0BwTq1za07290ttHNBTMwYod4ZLRmm41UbrC0/moNewOw/hpos4AA=='
  },
  'fen-3': {
    a: 'Ze Paulo',
    c: '#a7a794',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAwAgCdASoQAAsAA4BaJbACdAYuROTixzKQAAD+yQ8Q1POcCqMLmGpjRvw39EwZi9v+Uof2Ic5KDn/awqH9hSksbe1aFInpwaCUzA1kSHvFxJL7xbSrj01VnwthbQcAAAA='
  },
  'fln-1': {
    a: 'Thayran Melo',
    c: '#5c6b64',
    r: 1.333,
    q: 'data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAADQAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JYgCdACGu4bpsLH2qTwAA/tRnDMB/vkS6vFjMYqPFbEo9B3F7L3594RkgnR3L/FCxCuRKvSK9re4DNMEwF7pEpRAIV9/pXnjJvfn6xoOuzSOUbHFactfxPOEFNDWHOPZ9wquc7RamoxCOWQ41LCbK3AAAAA=='
  },
  'fln-2': {
    a: 'Paulo Kopzinski',
    c: '#6d898f',
    r: 0.75,
    q: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQAAwAA4BaJZgCdAEPNBw6nwAA/usyzAHWQWmosjPbHKA9/IKJVq/rXtkbbJ6EL/E25t00QHYke8C6j5ogF4BcieYXb5aZKs5YOqkZHwAAAA=='
  },
  'fln-3': {
    a: 'Gustavo Sánchez',
    c: '#706b4a',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQAgCdASoQAAsAA4BaJaACdAYvh21y+hP4loAA/unYIA8liNrv4DrQVsDzXrKDuSipUN85Ii0Pvx+QUbXgr621jqWlBhzGX98/EEtvvoRaDBgWxsVyEWnc+qjxdfdyBSGgAA=='
  },
  'igu-1': {
    a: 'Guilherme Madaleno',
    c: '#5f6668',
    r: 0.664,
    q: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAsAA4BaJZQCdADdm46WgAD+5D/xoHNKAscEEJWxv0Hcj1Z84Rlu/CbRkGA6GcnhmGPT0lRengmfHlQAAA=='
  },
  'igu-2': {
    a: 'Muhammed Ballan',
    c: '#6b7e77',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQAgCdASoQAAsAA4BaJbACdAEOzaRIwTTAAP3jvOoxyAyymtotUXuNqrHCe3PaAvm9hl5U3dzXfa4PshBb7xd3r2t64lg8MbEzwt1vT+VB/ub2EogGORbNuULIuVO/gAA='
  },
  'jjd-1': {
    a: 'Jonathan Borba',
    c: '#8f8c7b',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAsAA4BaJYgCdAEO0oS0EsAA/t+4OXTE/T6UUkzTpAPdRXlGHPzz/W0x2AyjTzf4xFzrkWOERhptEwgAAA=='
  },
  'jjd-2': {
    a: 'Sébastien Goldberg',
    c: '#a48e8a',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoQAAsAA4BaJQBOj+ADFV3s6bkQAP6YTxwPtSjYUm129G8nPB6BBhCwzce0AC8sRG0UYi+zL9WAI7ietdZCT4AA'
  },
  'jjd-3': {
    a: 'Biquara Digital Creative',
    c: '#97bec7',
    r: 0.75,
    q: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAwAA4BaJZgCdAEOoyhGeAD+7UdqB5q7KVe6Lm4ohn7Kt1Y2KvZR7Z2VITMXt5szfZhkK5UQAA=='
  },
  'mcz-1': {
    a: 'Lukas Souza',
    c: '#88a8a1',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACwAQCdASoQAAsAA4BaJbACdAENhNhgAP3jvK9foY7bImZvFkORvH0s2pY7O71SizrxZvFyJOg270GOB2KFeX40aAHF6xTsF1SDRDGiUwAAAA=='
  },
  'mcz-2': {
    a: 'Bruna Barros',
    c: '#4e8391',
    r: 1.778,
    q: 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAwBACdASoQABwAPu1iqU2ppaOiMAgBMB2JbACdMoADTpYbXCqn/5/fnMAA/rmQBw4fyLrnSw46Kw7B7U9phqI3fVKuu7eAlt9oRF5XmOXNaRd+jnYenu8WoYkt2ythRs5krjb29yA5894SsF84xKPiH8WdgYUoMDQSZoJMRBcPShGDmJmlbcAA'
  },
  'rio-1': {
    a: 'Marcos Paulo Prado',
    c: '#af6c32',
    r: 1.5,
    q: 'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAADwAwCdASoQABgAPu1iqU2ppaOiMAgBMB2JagCdMoRgAAcSuQy7X6ZAAPGqHEmRwGP0bKSkxY7sgupApzgr1lkKe73KBc8/OvYn96l3Q4u8DqMroKicVmRiET8mv4PGY5aX6LtdpUSj57JdgOWLDzrTagiBnEQvQtoQRDo9F+AAAA=='
  },
  'rio-2': {
    a: 'Agustin Diaz Gargiulo',
    c: '#aaa59a',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoQAAsAA4BaJQBOgCHhQQk55AAA/vBNTXalXBs6+hCpGnCQE3dEa5IgZnha7imoXG8WtimMbGGN3sw2xBLIheov4NgRrg3s9PSXMeWUsAA='
  },
  'rio-3': {
    a: 'Davi Costa',
    c: '#757e72',
    r: 1.333,
    q: 'data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADQAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JbACo9CD1c4eQyCqIT4AA/tTv2fuiICC2u4GMfUE/gfA8lSyBTQwH+RQx08R3jUxN/0O0BOjqj9dAnKOeOdoYwXXZfKfgsYaD6A8btNxokbE1PqshcFiThLeoIn8V8a31LmdGOnL+QAAA'
  },
  'sao-1': {
    a: 'Caroline Badran',
    c: '#9d927c',
    r: 1.5,
    q: 'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JQBdmUABp2nfviyCrAYK5KE4AAP5Zh43Bjy1q1E3gjz92UjtR8fet1HotvmQ5nl5baMRH6j2nz6wHGgTYgy70sP7vam+PhFM4MocM/9RgNNnfBEEBd6Jy4/c4ryOszc/QmYtfsrAAAA=='
  },
  'sao-2': {
    a: 'Raphael Nogueira',
    c: '#7aa1aa',
    r: 0.667,
    q: 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAABQAgCdASoQAAsAA4BaJbACdGuAAlSqFgnX/kAA/pqywwaRYeoYEyTpCgsxLPuGhhzP8ZZTrHbJzW0ifetTftCfPRBSmskAa7VdR1Yohv8d6YUwdA8+5nNDHNsKgOLyKJJ7XLrZo01AAA=='
  },
  'ssa-1': {
    a: 'José Maldonado',
    c: '#767465',
    r: 1.5,
    q: 'data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAACwAwCdASoQABgAPu1iqU2ppaOiMAgBMB2JQBjegphilZy13/piIAD2uLG3jocZM7pRZ8PsqT0qjRMXn2nXhRmXLaO2SYYjMt8irfogwF7vdQ+pGQsdQwwPCiuo3yaXw4LfBdRvZ1F7jXjuW+ziQ/MECChQAA=='
  },
  'ssa-2': {
    a: 'Edson Junior',
    c: '#9a6b25',
    r: 1,
    q: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQABAAA4BaJbACdLoAAmjOeADKo++0FK/zSR2abUlYTrfGvzS+UiTTVC0uCwy5SjyasP90JoYYCcJvsXdrmowZv8+gAA=='
  },
  'ssa-3': {
    a: 'Cleverson Magalhães',
    c: '#55717d',
    r: 1.582,
    q: 'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAABwBACdASoQABkAPu1iqk2ppaQiMAgBMB2JbACdOUAKj6bwMoS6bDnKETwIUAD9GxPNPnTqC2xuoTGJA53RXMbdSO6Thw/AObAt6pYeteKoAZYU9IXOvTgij5+3luI4jHfNqRNB/7CmV1Be7i858MErMEmAQQeP+dekJCmhELsbFpEcX4CUoKLZmcPOdghLY2BnSAAA'
  }
};

const PHOTO_FOCUS = {
  'ssa-1': '50% 42%',
  'rio-1': '50% 60%',
  'fen-1': '50% 32%',
  'fln-1': '50% 34%',
  'eze-1': '42% 50%',
  'mcz-2': '50% 60%',
  'sao-1': '50% 40%',
  'air-3': '50% 45%'
};
