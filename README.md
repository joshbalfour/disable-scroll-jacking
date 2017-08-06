![Logo](extension/icons/icon128.png)

## 🚫 Disable Scroll Jacking

Chrome Extension which disables scroll hijacking on websites.

By [Josh Balfour](https://twitter.com/joshbal4)

### Update
6th August 2017: submitted and under review on chrome extension store

### Description

Sick of websites hijacking your scrolling? 

I was.

So I made this Chrome extension to take back control of the scroll.


> Make scrolling bearable again.


### Demo

#### Before
Scroll = jacked! 👎

![Demo - Before](assets/demo-before.gif)

#### After
Scroll at your own pace 👍

![Demo - After](assets/demo-after.gif)

#### Ideas/Issues?

Please fill [This Form](https://gitreports.com/issue/joshbalfour/disable-scroll-jacking?name=optional&email=optional@co.com) in to let me know, or [@ me on twitter](https://twitter.com/joshbal4)!

#### Want to look at the code?

The extension consists of [a script](extension/src/inject/injector.js) which injects [another script](extension/src/inject/injected.js) into each page.

The extension's options page (also the browser action) is [here](extension/src/options/index.html).