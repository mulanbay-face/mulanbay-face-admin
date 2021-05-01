<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户昵称
                <div class="pull-right">{{ user.nickname }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="location" />常驻城市
                <div class="pull-right">{{ user.residentCity }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="level" />用户等级
                <div class="pull-right">
                  <svg-icon icon-class="v" />
                  {{ user.level }}
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="role" />所属角色
                <div class="pull-right">{{ user.roleName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建时间
                <div class="pull-right">{{ user.createdTime }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />过期时间
                <div class="pull-right">{{ user.expireTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>我的资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
            <el-tab-pane label="快速导航" name="fastMenu">
              <fastMenu :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import fastMenu from "./fastMenu";

import { getProfile } from "@/api/auth/user";

export default {
  name: "Profile",
  components: {
    userAvatar,
    userInfo,
    resetPwd,
    fastMenu
  },
  data() {
    return {
      user: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    //获取用户信息
    getUser() {
      getProfile().then(response => {
        this.user = response;
      });
    }
  }
};
</script>
