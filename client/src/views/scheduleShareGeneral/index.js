import PropTypes, { number, string } from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonAuthen, LoadingProvider, TableProvider } from 'src/components'
import { closeModalStatic, hideLoading, openNotifyErrorServer, showLoading } from 'src/utils'
import DetailScheduleShare from './DetailScheduleShare'
import { STATUS, optionsTypeSchedule } from 'src/constants'
import { getListShareScheduleApi } from 'src/services/shareSchedule'

function ScheduleShareGeneral() {
  const isUnmounted = useRef(false)
  const valueSearch = useRef()

  const [visible, setVisible] = useState(false)
  const [idDetail, setIdDetail] = useState()
  const [listShareSchedule, setListShareSchedule] = useState([])

  const [paging, setPaging] = useState({
    current_page: 1,
    limit: 10,
  })
  const { current_page, limit } = paging

  const idUser = localStorage.getItem('ID')

  const getListShareSchedule = useCallback(async () => {
    showLoading()
    try {
      const dataParams = {
        page: current_page,
        limit: limit,
        idUser: idUser,
        name_teacher_search: valueSearch.current,
      }
      const { data, statusCode } = await getListShareScheduleApi(dataParams)
      if (statusCode === STATUS.SUCCESS_NUM) {
        if (isUnmounted.current) return

        setListShareSchedule(data.data)
        if (data.data.length > 0) setPaging(data.paging)
      }
    } catch (error) {
      openNotifyErrorServer(error.response.data.message)
    }
    hideLoading()
  }, [current_page, limit, idUser])

  useEffect(() => {
    getListShareSchedule()
  }, [getListShareSchedule])

  const handleDetailScheduleShare = useCallback((idDetail) => {
    setVisible(true)
    setIdDetail(idDetail)
  }, [])

  /**
   * data matching with field table
   * Dữ liệu để render thông tin vào table tương ứng với các trường
   */
  const columns = useMemo(
    () => [
      {
        Header: 'Giáo viên chia sẻ',
        accessor: 'user_share',
        minWidth: 150,
      },
      {
        Header: 'Kiểu lịch trình',
        id: 'type_schedule',
        accessor: ({ type_schedule }) => {
          const typeSchedule = optionsTypeSchedule.find((val) => val.value === type_schedule)
          return <p>{typeSchedule.label}</p>
        },
        minWidth: 150,
      },
      {
        Header: 'Tiêu đề lịch trình',
        accessor: ({ type_schedule, lecture_content, course_schedule }) => {
          if (type_schedule === 'evtType') {
            return <p>{lecture_content}</p>
          } else {
            return <p>{course_schedule.label}</p>
          }
        },
        minWidth: 200,
      },
      {
        Header: 'Số tín chỉ',
        accessor: 'total_credit_points',
        minWidth: 50,
      },
      {
        Header: 'Tổng số tiết học',
        accessor: 'total_num_lessons',
        minWidth: 50,
      },
      {
        Header: 'Giáo viên phụ trách',
        accessor: 'responsible_teacher',
        minWidth: 150,
      },
      {
        Header: 'Mô tả',
        accessor: 'description',
        minWidth: 300,
      },
      {
        Header: 'Hoạt động',
        id: 'action',
        accessor: ({ _id }) => {
          return (
            <div className="d-flex justify-content-center">
              <div className="">
                <ButtonAuthen
                  isDetail
                  isAuthorized
                  onClick={() => {
                    handleDetailScheduleShare(_id)
                  }}
                >
                  <div className="text-white">Chi tiết</div>
                </ButtonAuthen>
              </div>
            </div>
          )
        },
        minWidth: 100,
      },
    ],
    [handleDetailScheduleShare],
  )

  useEffect(() => {
    return () => {
      isUnmounted.current = true
      closeModalStatic()
    }
  }, [])

  return (
    <div>
      <DetailScheduleShare
        visible={visible}
        setVisible={setVisible}
        idDetail={idDetail}
        listShareSchedule={listShareSchedule}
      />
      <h3 className="title-content">Danh sách lịch trình được chia sẻ</h3>
      <LoadingProvider>
        <div className="p-3">
          <TableProvider
            data={listShareSchedule}
            formatColumn={columns}
            paging={paging}
            setPaging={setPaging}
          />
        </div>
      </LoadingProvider>
    </div>
  )
}

ScheduleShareGeneral.propTypes = {
  value: PropTypes.oneOfType([string, number]),
  id: PropTypes.number,
}

export default React.memo(ScheduleShareGeneral)
