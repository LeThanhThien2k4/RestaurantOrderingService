import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { features, stats, teamMembers } from '../../assets/dummydata';
import { FaXTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div className=' min-h-screen bg-gradient-to-br from-[#1a120b] via-[#3c2a21] to-[#1a120b] text-amber-50
     overflow-hidden relative '>
      <div className=' absolute inset-0 opacity-10 mix-blend-soft-light' />

      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
        <div className=' py-16 px-4 text-center relative'>
          <div className=' max-w-4xl mx-auto'>
            <motion.h1 className=' text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-serif bg-clip-text text-transparent
            bg-gradient-to-r from-amber-500 to-yellow-600'>
              {t("about.title")}
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t("about.subtitle")}
            </motion.p>

          </div>
        </div>
      </motion.section>

      <section className=' py-12 px-4 md:px-8 relative'>
        <div className=' max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12'>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ delay: i * 0.2 }} className=' relative group'>
                <div className=' absolute -inset-1 bg-gradient-to-br from-amber-600/30 to-amber-500/30 rounded-3xl 
                    blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500' />

                <div className=' relative bg-[#3c2a21]/90 backdrop-blur-lg rounded-3xl overflow-hidden 
                        border border-amber-600/30 hover:border-amber-500 transition-all duration-300 h-full'>
                  <div className=' relative h-64 overflow-hidden'>
                    <motion.img src={f.img} alt={f.title} className=' w-full h-full object-cover'
                      initial={{ scale: 1 }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
                    <div className=' absolute inset-0 bg-gradient-to-t from-[#1a120b] via-transparent
                             to-transparent' />
                  </div>

                  <div className=' p-8'>
                    <motion.div className=' text-amber-500 mb-4 inline-block'
                      whileHover={{ rotate: 15 }}>
                      <Icon className=' w-12 h-12 text-amber-500 ' />
                    </motion.div>
                    <h3 className=' text-2xl font-bold mb-2 text-amber-100'>{t(`about.features.${f.id}.title`)}</h3>
                    <p className=' text-amber-100/80'>{t(`about.features.${f.id}.text`)}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className=' py-16 px-4 md:px-8 bg-gradient-to-br from-[#1a120b] to-[#3c2a21]/90 '>
        <div className=' max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, type: 'spring' }}
                className='relative group h-48' onHoverStart={() => setHoveredStat(i)}
                onHoverEnd={() => setHoveredStat(null)}
                animate={{
                  scale: hoveredStat === i ? 1.05 : 1,
                  zIndex: hoveredStat === i ? 10 : 1
                }}>
                {/* giữ nguyên số liệu */}
                <div className='relative z-10 h-full flex flex-col items-center justify-center'>
                  <Icon className='w-8 h-8 text-amber-500/90' />
                  <div className='text-4xl font-bold mb-1 bg-clip-text bg-gradient-to-r
                                                        from-amber-200 to-amber-400 text-transparent'>
                    {s.number}
                  </div>
                  <motion.div className='text-sm uppercase tracking-widest font-medium
                                                        text-amber-100/80'>
                    {t(`about.stats.${s.id}.label`)}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className='py-16 px-4 md:px-8 relative'>
        <div className='max-w-7xl mx-auto'>
          <motion.h2 initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className='text-4xl font-serif sm:text-5xl md:text-6xl font-bold text-center mb-12 text-amber-100'>
            {t("about.teamTitle")} <span className='text-amber-500'>{t("about.teamHighlight")}</span>
          </motion.h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12'>
            {teamMembers.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ delay: m.delay }} className='relative group'>
                <div className='relative h-full bg-[#3c2a21]/90 backdrop-blur-lg rounded-3xl overflow-hidden
                            border-2 border-amber-600/30 hover:border-amber-500 transition-all duration-500 shadow-xl
                            hover:shadow-2xl hover:shadow-amber-500/20'>
                  <div className='relative h-64 sm:h-72 md:h-96 overflow-hidden'>
                    <motion.img src={m.img} alt={m.name} className='w-full h-full
                                object-cover' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }} />
                  </div>

                  <div className='p-8 text-center flex flex-col h-[calc(100%-24rem)]'>
                    <div className='mb-4'>
                      <h3 className='text-3xl font-bold mb-2 text-amber-100'>{m.name}</h3>
                      <p className='text-amber-500 text-lg font-medium font-cursive'>
                        {t(`about.team.${i}.role`)}
                      </p>
                    </div>
                    <p className='text-amber-100/80 text-lg font-cursive flex-grow'>
                      {t(`about.team.${i}.bio`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
