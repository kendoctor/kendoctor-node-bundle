<?php

namespace Kendoctor\Bundle\NodeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PageCategory
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Kendoctor\Bundle\NodeBundle\Entity\PageCategoryRepository")
 */
class PageCategory
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=50)
     */
    private $name;

    
    /**
     *
     * @var type 
     * 
     * @ORM\OneToMany(targetEntity="Page", mappedBy="category")
     */
    private $pages;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return PageCategory
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->pages = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add pages
     *
     * @param \Kendoctor\Bundle\NodeBundle\Entity\Page $pages
     * @return PageCategory
     */
    public function addPage(\Kendoctor\Bundle\NodeBundle\Entity\Page $pages)
    {
        $this->pages[] = $pages;
    
        return $this;
    }

    /**
     * Remove pages
     *
     * @param \Kendoctor\Bundle\NodeBundle\Entity\Page $pages
     */
    public function removePage(\Kendoctor\Bundle\NodeBundle\Entity\Page $pages)
    {
        $this->pages->removeElement($pages);
    }

    /**
     * Get pages
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getPages()
    {
        return $this->pages;
    }
    
    public function __toString()
    {
        return $this->name;
    }
}