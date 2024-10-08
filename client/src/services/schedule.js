/* eslint-disable prettier/prettier */
import {
  DATE_FORMAT,
  TIME_FORMAT_ONLY,
  optionsStatusSchedule,
  optionsTypeSchedule,
} from 'src/constants'
import API from './api'
import { httpRequest } from './http.service'
import moment from 'moment'

export const createSchedule = async (data) => {
  const response = await httpRequest().post(API.CREATE_SCHEDULE, data)
  return response
}

export const updateSchedule = async (id, dataEdit) => {
  const url = `${API.EDIT_SCHEDULE}/${id}`
  const response = await httpRequest().put(url, dataEdit)

  return response
}

export const getListSchedule = async (data) => {
  let params = {}

  if (data.page) params.page = data.page
  if (data.limit) params.limit = data.limit
  if (data.idUser) params.idUser = data.idUser
  if (data.name_schedule_search) params.name_schedule_search = data.name_schedule_search

  const response = await httpRequest().get(API.GET_INFO_SCHEDULE, {
    params,
  })

  return response
}

export const getDetailScheduleApi = async (id) => {
  const url = `${API.DETAIL_SCHEDULE}/${id}`

  const { statusCode, data } = await httpRequest().get(url)

  const dataSchedule = data.data
  const {
    course_schedule,
    description,
    id_user_create,
    lecture_content,
    responsible_teacher,
    schedules,
    total_credit_points,
    total_num_lessons,
    type_schedule,
  } = dataSchedule

  const values = {
    course_schedule,
    description,
    id_user_create,
    lecture_content,
    responsible_teacher,
    schedules: schedules.map((schedule) => {
      return {
        ...schedule,
        status_schedule: optionsStatusSchedule.find(
          (val) => val.value === schedule.status_schedule,
        ),
        schedule_date: moment(schedule.schedule_date, DATE_FORMAT),
        time_start: moment(schedule.time_start, TIME_FORMAT_ONLY),
        time_end: moment(schedule.time_end, TIME_FORMAT_ONLY),
        schedule_date_other: schedule.schedule_date_other
          ? moment(schedule.schedule_date_other, DATE_FORMAT)
          : '',
        time_start_other: schedule.time_start_other
          ? moment(schedule.time_start_other, TIME_FORMAT_ONLY)
          : '',
        time_end_other: schedule.time_end_other
          ? moment(schedule.time_end_other, TIME_FORMAT_ONLY)
          : '',
      }
    }),
    total_credit_points,
    total_num_lessons,
    type_schedule: optionsTypeSchedule.find((val) => val.value === type_schedule),
  }

  return { statusCode, values }
}

export const getFullScheduleApi = async (data) => {
  let params = {}

  if (data.name_teacher_search) params.name_teacher_search = data.name_teacher_search

  const response = await httpRequest().get(API.GET_FULL_SCHEDULE, {
    params,
  })

  return response
}

export const getShareScheduleApi = async (id) => {
  const url = `${API.GET_SHARE_SCHEDULE}/${id}`
  const response = await httpRequest().get(url)

  return response
}
