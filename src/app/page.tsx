'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FaVideo, FaChalkboardTeacher, FaRobot, FaChartLine, 
  FaUsers, FaTrophy, FaBookReader, FaGraduationCap,
  FaClock, FaPencilAlt, FaApple, FaBook, FaLightbulb, FaChalkboard
} from "react-icons/fa";

export default function Home() {
  const wiggle = {
    rotate: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3
    }
  };

  const bounce = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      {/* Doodly Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="sticky top-0 z-50 border-b-4 border-green-800 bg-yellow-100/95 backdrop-blur-sm shadow-lg"
        style={{
          borderRadius: "0 0 50% 50% / 0 0 20px 20px"
        }}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              animate={wiggle}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 border-4 border-green-800 shadow-lg"
              style={{ 
                borderRadius: "50% 45% 48% 52% / 52% 48% 52% 48%"
              }}
            >
              <FaChalkboard className="text-2xl text-white" />
            </motion.div>
            <span className="text-xl font-bold text-green-800" style={{
              textShadow: "2px 2px 0px rgba(0,0,0,0.1)"
            }}>
              ClassRoom
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="doodle-button border-green-800 bg-white hover:bg-green-50 text-green-800 font-bold text-lg px-6"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 0.95 }}>
                <Button className="doodle-button bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 border-green-800">
                  <FaPencilAlt className="mr-2" />
                  Join Now!
                </Button>
              </motion.div>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section - Chalkboard Style */}
      <section className="container mx-auto px-4 py-16">
        <div className="chalkboard-bg rounded-3xl p-12 shadow-2xl border-4 border-amber-900 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center relative z-10"
          >
            <motion.div animate={bounce} className="mb-6 inline-block">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-5 py-2 text-base font-semibold text-green-800 border-3 border-yellow-600 shadow-md">
                <FaLightbulb className="text-lg" />
                AI-Powered Education Platform
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{
              textShadow: "3px 3px 0px rgba(0,0,0,0.3)"
            }}>
              Welcome to
              <br />
              <span className="text-yellow-300">ClassRoom Fun!</span>
            </h1>

            <p className="text-lg md:text-xl text-green-100 mb-10 font-medium leading-relaxed">
              Where learning meets innovation. Join teachers and students in our interactive online classroom.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="doodle-button bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold text-lg px-8 py-6 border-3 border-yellow-700 shadow-lg">
                    <FaGraduationCap className="mr-2 text-xl" />
                    Start Learning
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="doodle-button bg-green-400 hover:bg-green-500 text-green-900 font-bold text-lg px-8 py-6 border-3 border-green-700 shadow-lg">
                    <FaChalkboardTeacher className="mr-2 text-xl" />
                    I'm a Teacher
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fun Stats - Notebook Style */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="notebook-lines rounded-3xl p-12 border-l-8 border-red-400 shadow-2xl relative"
        >
          <div className="absolute top-0 left-8 w-1 h-full bg-red-400"></div>
          
          <h2 className="text-3xl font-bold text-green-800 mb-12 text-center" style={{
            textShadow: "2px 2px 0px rgba(0,0,0,0.1)"
          }}>
            Platform Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ml-8">
            {[
              { icon: FaUsers, number: "10,000+", label: "Happy Students" },
              { icon: FaChalkboardTeacher, number: "500+", label: "Teachers" },
              { icon: FaVideo, number: "5,000+", label: "Classes" },
              { icon: FaTrophy, number: "50,000+", label: "Achievements" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, rotate: Math.random() > 0.5 ? 3 : -3 }}
                className="text-center"
              >
                <stat.icon className="text-4xl text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-base font-semibold text-gray-700">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features - Doodle Cards */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-green-800 mb-16"
          style={{
            textShadow: "2px 2px 0px rgba(0,0,0,0.1)"
          }}
        >
          Platform Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: FaVideo, 
              title: "Live Video Classes", 
              desc: "See your teacher and friends in real-time!",
              color: "bg-blue-100",
              borderColor: "border-blue-600"
            },
            { 
              icon: FaRobot, 
              title: "AI Study Buddy", 
              desc: "Ask questions anytime, get instant help!",
              color: "bg-purple-100",
              borderColor: "border-purple-600"
            },
            { 
              icon: FaChartLine, 
              title: "Track Your Progress", 
              desc: "Watch yourself grow smarter every day!",
              color: "bg-green-100",
              borderColor: "border-green-600"
            },
            { 
              icon: FaBookReader, 
              title: "Fun Materials", 
              desc: "Cool videos, games, and activities!",
              color: "bg-yellow-100",
              borderColor: "border-yellow-600"
            },
            { 
              icon: FaTrophy, 
              title: "Earn Rewards", 
              desc: "Get badges and points for being awesome!",
              color: "bg-red-100",
              borderColor: "border-red-600"
            },
            { 
              icon: FaApple, 
              title: "Homework Helper", 
              desc: "Never feel stuck on homework again!",
              color: "bg-orange-100",
              borderColor: "border-orange-600"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                y: -5
              }}
            >
              <Card className={`doodle-card ${feature.color} border-4 ${feature.borderColor} h-full`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${feature.color} border-3 ${feature.borderColor}`}>
                      <feature.icon className="text-2xl" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base font-medium text-gray-700">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="doodle-card bg-gradient-to-br from-green-400 via-yellow-300 to-blue-400 p-12 text-center border-4 border-green-800 shadow-xl"
        >
          <motion.div animate={wiggle} className="inline-block mb-4">
            <FaPencilAlt className="text-5xl text-white" style={{
              filter: "drop-shadow(3px 3px 0px rgba(0,0,0,0.3))"
            }} />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{
            textShadow: "3px 3px 0px rgba(0,0,0,0.3)"
          }}>
            Ready to Get Started?
          </h2>
          
          <p className="text-lg text-green-900 font-semibold mb-8 max-w-2xl mx-auto">
            Join thousands of students and teachers already learning on our platform.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/register">
              <Button className="doodle-button bg-white hover:bg-gray-100 text-green-800 font-bold text-xl px-12 py-6 border-4 border-green-800 shadow-xl">
                <FaGraduationCap className="mr-3 text-2xl" />
                Sign Up Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-green-800 bg-yellow-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold text-green-800">
            Made with 💚 for students and teachers
          </p>
          <p className="text-base text-gray-700 mt-2">
            © 2026 ClassRoom - Interactive Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
