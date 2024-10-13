import React, { useState } from 'react'

const usePagination = () => {
    const [limit, setLimit] = useState(0)
    const [page, setPage] = useState(0)
    const [page_size] = useState(15)
    return { page, setPage, page_size, limit, setLimit }
}

export { usePagination }
