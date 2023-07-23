import React from 'react'

const styles = {
  controlButtons: 'text-4xl text-custom-blue hover:text-custom-blue/60 mx-4',
  pageButton: 'border-1 border-custom-blue/40 hover:border-custom-blue  hover:scale-90 ease-in duration-200 font-thin',
  pageButtonActive: 'border-2 border-custom-blue font-bold',
}

const Pagination = ({ totalPages, activePage, setActivePage }) => {
  const Page = ({ page }) => {
    return (
      <button
        className={'w-10 h-10 text-center text-custom-blue mx-1 ' + (page === activePage ? styles.pageButtonActive : styles.pageButton)}
        onClick={() => setActivePage(page)}
      >
        {page}
      </button>
    )
  }

  const Gap = () => {
    return (
      <div className='w-10 h-10 text-center text-custom-blue mx-1 pointer-events-none'>
        ...
      </div>
    )
  }

  // pagination logic
  const pages = [];
  let gap = false;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(activePage - i) <= 2) {
      pages.push(<Page page={i} />)
      gap = false;
    } else if (!gap) {
      pages.push(<Gap />)
      gap = true;
    }
  }

  return (
    <div className='flex items-center w-full justify-end'>
      <button
        className={styles.controlButtons}
        onClick={() => {
          if (activePage > 1) {
            setActivePage(oldState => oldState - 1)
          }
        }}>
        {'<-'}
      </button>
      {pages}
      <button
        className={styles.controlButtons}
        onClick={() => {
          if (activePage < totalPages) {
            setActivePage(oldState => oldState + 1)
          }
        }}>
        {'->'}
      </button>
    </div>
  )
}

export default Pagination